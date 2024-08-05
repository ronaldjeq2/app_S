/**
 * # account/handlers.js
 *
 * This handles all the account actions
 *
 */
"use strict";
/**
 * ## Imports
 *
 */

const redisClient = require("../../database/redis"),
    Boom = require("boom"), //Boom is an abstraction over http error codes
    aguid = require("aguid"),
    JwtAuth = require("../../auth/jwt-strategy"),
    JavaScriptObfuscator = require("javascript-obfuscator"),
    oracledb = require("oracledb"),
    CryptoJS = require("crypto-js");

const gb_third_party_access = require("../../database/banner_api/gb_third_party_access");
const gb_common = require("../../database/banner_api/gb_common");
const api_user = require("../../database/banner_api/usr_info");
const obfuscatorOptions = require("../../common/config/obfuscator");

const onesignal = require("../../common/onesignal");
const fnsFormat = require("date-fns/format");
const _ = require("lodash");

let internals = {};

/**
 * Handle the account/login endpoint and validate the
 * user with password througth oracledb connection
 *
 * parameters are received through request.payload
 * @param {String} username - User ID / The Banner PID of the user.
 * @param {String} password - NIP / Personal Identification Number(pin).
 *
 * @returns {String} token - in the response header.
 * @see https://en.wikipedia.org/wiki/JSON_Web_Token for more information
 */

internals.checkUserExists = async function (db, pid) {
    try {
        const q = await db.execute(...gb_common.f_id_exists(pid));

        return q && q.outBinds && q.outBinds.result !== 0;
    } catch (e) {
        console.log("--- ERROR ---");
        console.log("---DATA---", `PID: ${pid}`);
        console.log(e);
        throw Error("Error on checkUserExists");
    }
};

internals.getBannerPidm = async function (db, pid) {
    try {
        const q = await db.execute(...gb_common.f_get_pidm(pid));
        return q && q.outBinds && q.outBinds.result;
    } catch (e) {
        console.log("--- ERROR ---");
        console.log("---DATA---", `PID: ${pid}`);
        console.log(e);
        throw Error("Error on getBannerPidm");
    }
};

internals.checkCredentials = async function (db, credentials) {
    let validate = {
        isValid: false,
        isDisabled: true,
        isExpired: true
    };
    const newNalidation =
        process.env.NODE_ENV === "test" && credentials.password !== "1234568";
    if (process.env.NODE_ENV === "DEV" || newNalidation) {
        return {
            isValid: true,
            isDisabled: false,
            isExpired: false
        };
    }

    try {
        const q = await db.execute(
            ...gb_third_party_access.f_validate_pin(
                credentials.pidm,
                credentials.password
            )
        );

        const data = q && q.outBinds;

        if (data) {
            validate.isDisabled = data.p_disable_ind !== "N";
            validate.isExpired = data.p_disable_ind !== "N";
            validate.isValid = data.result === 1;
        } else {
            throw Error("no data returned on checkCredentials");
        }
    } catch (e) {
        console.log("--- ERROR on checkCredentials ---");
        console.log("--- Credentials ---", credentials);
        console.log(e);
    }
    return validate;
};

internals.generateToken = function (credentials) {
    let encryptedPwd = CryptoJS.AES.encrypt(
        credentials.password,
        process.env.CRYPTO_PRIVATE_KEY
    ).toString();

    let session = {
        valid: true, // this will be set to false when the person logs out
        id: aguid(), // a random unique session id
        userId: credentials.username,
        pid: credentials.pid,
        pidm: credentials.pidm,
        hash: encryptedPwd,
        inst: process.env.ORACLE_DB_CONN.split("/")[1],
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // expires in 30 days
    };
    // sign the session as a JWT
    return JwtAuth.createToken(session);
};

internals.loginUser = async function (request, h) {
    try {
        const credentials = {
            username: request.payload.username,
            password: request.payload.password
        };

        const versionApp = request.raw.req.headers["x-app-version"];
        const Istest =
            process.env.NODE_ENV === "test" || process.env.NODE_ENV === "DEV";
        if (versionApp === undefined && !Istest) {
            return Boom.unauthorized(
                "Por favor, actualiza la version del APP para poder ingresar"
            );
        }

        /** Fill pid with zero lef pad - 09 characters total length **/
        const banner_p_pid =
            "000000000".substring(0, 9 - credentials.username.length) +
            credentials.username;
        const banner_p_pin = credentials.password;

        let db = request.app.db;

        /** Check if user exists **/
        const userExist = await internals.checkUserExists(db, banner_p_pid);
        if (userExist) {
            /** GET the PIDM **/
            const banner_p_pidm = await internals.getBannerPidm(db, banner_p_pid);

            credentials.pid = banner_p_pid;
            credentials.pidm = banner_p_pidm;
            /** validate credentials **/
            const checkCredentials = await internals.checkCredentials(
                db,
                credentials
            );
            if (checkCredentials.isDisabled) {
                return h
                    .response({
                        error: {
                            level: "INFO",
                            type: "ACCOUNT_BLOCKED",
                            message: "La cuenta esta deshabilitada"
                        }
                    })
                    .code(203);
            } else if (checkCredentials.isExpired) {
                return h
                    .response({
                        error: {
                            level: "INFO",
                            type: "ACCOUNT_PASSWORD_EXPIRED",
                            message: "Tu cuenta ha expirado"
                        }
                    })
                    .code(203);
            } else if (checkCredentials.isValid) {
                const token = internals.generateToken(credentials);
                return h
                    .response({
                        userId: credentials.pid,
                        bannerPID: credentials.pid,
                        bannerPIDM: credentials.pidm
                    })
                    .header("Authorization", token);
            } else {
                return h
                    .response({
                        error: {
                            level: "INFO",
                            type: "PASSWORD_INCORRECT",
                            message: "Contraseña incorrecta"
                        }
                    })
                    .code(203);
            }
        } else {
            return h.response({
                error: {
                    level: "INFO",
                    type: "USER_NOT_EXIST",
                    message: "El usuario no existe"
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
};

/**
 * Handle the account/info endpoint - previus the validate authorization header
 *
 * @returns {Object}
 */

internals.get_user_info = async function (request, h) {
    let credentials = request.auth.credentials;
    const user = {
        id: "",
        pidm: "",
        docType: "DNI",
        numDoc: "123456789",
        firstName: "Jhon",
        middleName: "",
        lastName: "Doe",
        lastPeriodVigent: "1",
        hasStudentCard: false,
        hasWorkCard: false,
        studentCard: {
            career: "",
            program: ""
        },
        hasPhoto: false,
        photo: {
            height: 150,
            width: 150
        },
        workerDetail: {},
        careerDetail: {},
        curriculumDetail: {},
        addressList: [],
        phoneList: [],
        emailList: []
    };
    try {
        await request.app.db
            //         // Identification
            .execute(...api_user.get_identification(credentials.pidm))

            .then(result => {
                if (result.rows.length > 0) {
                    const row = result.rows[0];
                    user.id = row["ID"];
                    user.pidm = row["PIDM"];

                    user.numDoc = row["NUMDOC"].slice(0, -1);
                    user.docType = row["NUMDOC"].slice(-1);

                    if (user.docType === "D") {
                        user.docType = "DNI";
                    }

                    user.firstName = row["FIRST_NAME"];
                    user.middleName = row["MIDDLE_NAME"];
                    user.lastName = row["LAST_NAME"];
                    user.birthday = row["BIRTH_DATE"];
                }
                return request.app.db.execute(...api_user.period_list(credentials.pid));
            })
            //Period List
            .then(result => {
                let periodo = null;
                if (result.rows.length > 0) {
                    result.rows.map(component => {
                        const period = component["PERIODO"];
                        periodo = periodo > period ? periodo : period;
                    });
                }
                user.lastPeriodVigent = periodo;
                return request.app.db.execute(
                    ...api_user.career_detail(periodo, credentials.pid)
                );
            })

            //    Career Detail
            .then(result => {
                if (result.rows.length > 0) {
                    result.rows.map(component => {
                        const bloques =
                            component["BLOQUES"] === null
                                ? component["BLOQUES"]
                                : component["BLOQUES"].split(";");
                        const clases =
                            component["CLASES"] === null
                                ? component["CLASES"]
                                : component["CLASES"].split(";");
                        user.careerDetail["firstPeriod"] = component["PRIMER_PERIODO"];
                        user.careerDetail["currentPeriod"] = component["PERIODO_RECIENTE"];
                        user.careerDetail["studenType"] = component["TIPO_ALUMNO"];
                        user.careerDetail["blocks"] = bloques;
                        user.careerDetail["lessons"] = clases;

                        user.curriculumDetail["level"] = component["NIVEL"];
                        user.curriculumDetail["program"] = component["PROGRAMA"];
                        user.curriculumDetail["school"] = component["ESCUELA"];
                        user.curriculumDetail["campus"] = component["CAMPUS"];
                    });
                } else {
                    user.careerDetail = {};
                    user.curriculumDetail = {};
                }

                //user.lastPeriodVigent = periodo;
                return request.app.db.execute(
                    ...api_user.list_address(credentials.pidm)
                );
            })

            // Address List
            .then(result => {
                for (let i = 0; i < result.rows.length; i++) {
                    const row = result.rows[i];

                    user.addressList.push({
                        key: aguid(),
                        address: row["STREET_ADDRESS"],
                        city: row["CITY"],
                        type: row["TYPE"]
                    });
                }
                return request.app.db.execute(...api_user.phone_list(credentials.pidm));
            })

            // Phone List
            .then(result => {
                for (let i = 0; i < result.rows.length; i++) {
                    const row = result.rows[i];

                    user.phoneList.push({
                        key: aguid(),
                        number: row["PHONE_NUMBER"],
                        area: row["PHONE_AREA"],
                        type: row["TYPE"]
                    });
                }
                return request.app.db.execute(...api_user.list_email(credentials.pidm));
            })

            // Email List
            .then(result => {
                for (let i = 0; i < result.rows.length; i++) {
                    const row = result.rows[i];
                    user.emailList.push({
                        key: aguid(),
                        code: row["EMAIL_CODE"],
                        address: row["EMAIL_ADDRESS"],
                        status: row["STATUS_IND"],
                        preferred: row["PREFERRED_IND"] === "Y"
                    });
                }
                // Verify if exist fotocheck
                return request.app.db.execute(
                    ...[
                        `
                select * from table(SENATI.gwzwapp.f_datos_fotocheck_tbl( :idAlumno ))
              `,
                        {
                            idAlumno: {
                                dir: oracledb.BIND_IN,
                                type: oracledb.STRING,
                                maxSize: 9,
                                val: credentials.pid
                            }
                        },
                        { outFormat: oracledb.OBJECT }
                    ]
                );
            })

            .then(result => {
                if (result.rows.length > 0) {
                    user.hasStudentCard = true;
                    user.studentCard.career = result.rows[0]["CARRERA"];
                    user.studentCard.program = result.rows[0]["PROGRAMA"];
                }

                return request.app.db.execute(
                    ...[
                        `
                    select
                    SZRFOTO_ALTO as HEIGHT,
                    SZRFOTO_ANCHO as WIDTH
                    from SENATI.SZRFOTO where SZRFOTO_PIDM = :pidm and rownum = 1
                  `,
                        {
                            pidm: {
                                dir: oracledb.BIND_IN,
                                type: oracledb.INTEGER,
                                val: credentials.pidm
                            }
                        },
                        { outFormat: oracledb.OBJECT }
                    ]
                );
            })

            .then(result => {
                if (result.rows.length > 0) {
                    (user.hasPhoto = true),
                        (user.photo = {
                            height: result.rows[0]["HEIGHT"],
                            width: result.rows[0]["WIDTH"]
                        });
                }
                // Reply
                // reply(user);
                return request.app.db.execute(
                    ...api_user.worker_detail(credentials.pidm)
                );
            })
            // workerDetail
            .then(result => {
                let hasWorkCard = false;
                if (result.rows.length > 0) {
                    result.rows.map(component => {
                        user.workerDetail["Zonal"] = changueFormat(component["ZONAL"]);
                        user.workerDetail["Cargo"] = component["CARGO"];
                        user.workerDetail["Fecha_Cese"] =
                            component["FECHA_CESE"] === null
                                ? ""
                                : transforLastAssistance(component["FECHA_CESE"]);
                        hasWorkCard =
                            component["FECHA_CESE"] === null ||
                                component["FECHA_CESE"].toISOString() > new Date().toISOString()
                                ? true
                                : false;
                    });
                }
                user.hasWorkCard = hasWorkCard;

                // reply(user);
            }) // Error catch
            .catch(error => {
                console.log(error);
            });
        return user;
    } catch (e) {
        console.log(e);
    }
};

/**
 * Handle the account/ssb endpoint
 *
 * @returns {string}
 */
function changueFormat(text) {
    if (typeof text === "string" && text.trim().length > 0) {
        const word = text.toLowerCase().split(" ");
        const arrayLetter = [];
        word.map(item => {
            const variable = item.split("");
            variable[0] = variable[0].toUpperCase();
            arrayLetter.push(variable.join(""));
        });
        console.log(arrayLetter);
        return arrayLetter.join(" ");
    } else {
        return null;
    }
}
function transforLastAssistance(assistanceDate) {
    const newFormateDate = assistanceDate
        .toISOString()
        .split("T")[0]
        .split("-");

    return newFormateDate[2] + "-" + newFormateDate[1] + "-" + newFormateDate[0];
}

internals.get_ssb_login = async function (request, h) {
    let credentials = request.auth.credentials;

    let user = {};

    try {
        // Decrypt
        var bytes = CryptoJS.AES.decrypt(
            credentials.hash,
            process.env.CRYPTO_PRIVATE_KEY
        );
        var decryptedPwd = bytes.toString(CryptoJS.enc.Utf8);

        let pid = credentials.pid;
        let pwd = decryptedPwd;

        const instance = (credentials.inst || "PROD").toUpperCase();

        const checkCredentials = await internals.checkCredentials(request.app.db, {
            pidm: credentials.pidm,
            password: decryptedPwd
        });

        // ACCOUNT DISABLED
        if (checkCredentials.isDisabled) {
            return h
                .response({
                    error: {
                        level: "info",
                        key: "ACCOUNT_BLOCKED",
                        message: "La se cuenta se encuentra deshabilitada"
                    }
                })
                .code(203);

            // PASSWORD EXPIRED
        } else if (checkCredentials.isExpired) {
            return h
                .response({
                    error: {
                        level: "info",
                        key: "ACCOUNT_PASSWORD_EXPIRED",
                        message: "Tu contraseña ha expirado"
                    }
                })
                .code(203);

            // PASSWORD IS NOT LONGER VALID
        } else if (checkCredentials.isValid === false) {
            return h
                .response({
                    error: {
                        level: "info",
                        key: "ACCOUNT_PASSWORD_INVALID",
                        message:
                            "Se detecto un cambio de contraseña debes cerrar sesion e ingresar con tu nueva contraseña"
                    }
                })
                .code(203);

            // PASSWORD IS VALID
        } else {
            let code = `
            var pin = '${pid}';
            var pwd = '${pwd}';
            if( document.getElementsByName('sid').length > 0
                && !document.getElementsByName('web_stop')[0]
            ){
                document.getElementsByName('sid')[0].value = pin;
                document.getElementsByName('PIN')[0].value = pwd;
                document.getElementsByName('loginform')[0].submit();
            }
        `;
            let obfuscationResult = JavaScriptObfuscator.obfuscate(
                code,
                obfuscatorOptions
            );
            return {
                code: obfuscationResult._obfuscatedCode,
                uri: `https://sinfo.senati.edu.pe/${instance}/twbkwbis.P_ValLogin`
            };
        }
    } catch (error) {
        console.log("=============== ERROR ===================");
        console.log(error);
        console.log("====================================");
        return {
            error: {
                level: "error",
                key: "UNKNOWN",
                message: error.message
            }
        };
    }
};

internals.getNotificationTags = async function (request, h) {
    let credentials = request.auth.credentials;

    let firstName = "Senatino";
    try {
        const query = await request.app.db.execute(
            `SELECT
            SPRIDEN.SPRIDEN_FIRST_NAME AS FIRST_NAME
        FROM
            SATURN.SPRIDEN
        WHERE
            SPRIDEN.SPRIDEN_PIDM = :pidm AND
            SPRIDEN.SPRIDEN_CHANGE_IND IS NULL`,
            {
                pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.INTEGER,
                    maxSize: 128,
                    val: credentials.pidm
                }
            }
        );

        console.log(query);

        if (query.rows && query.rows.length > 0 && query.rows[0][0]) {
            firstName = query.rows[0][0];
        }
    } catch (error) {
        console.log(error);
    }

    let tags = {
        userId: credentials.pidm,
        firstName
    };

    return {
        data: { tags },
        tags
    };
};

internals.postNotificationToken = function (request, h) {
    let credentials = request.auth.credentials;

    let token = request.payload.token;

    const db = request.mongo.db;

    db.collection("devices").updateOne(
        { playerId: token },
        {
            $set: {
                userId: credentials.userId,
                pidm: credentials.pidm,
                lastModified: new Date()
            }
        },
        { upsert: true }
    );

    return {};
};

module.exports = internals;
