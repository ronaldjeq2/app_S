/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
"use strict";

const VERIFICATION_CODE_MINIMUM_RETRY_TIME = 5 * 60 * 1000; // 5 minutes
const VERIFICATION_CODE_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

const RequestPromise = require("request-promise");
const Boom = require("boom"),
    oracledb = require("oracledb");

const Mailchecker = require("mailchecker");

const CryptoJS = require("crypto-js");
const MailGun = require("mailgun-js");

const crypto_key = `Hk2t{-_6x{)87D4d`;
const separator = ";";

const make_encrypted_complex_id = complex_id_array => {
    const complexId = complex_id_array.join(separator);
    return encodeURIComponent(
        CryptoJS.AES.encrypt(complexId, crypto_key).toString()
    );
};

const decrypt_complex_id = email_id => {
    const decrypted = CryptoJS.AES.decrypt(
        decodeURIComponent(email_id),
        crypto_key
    ).toString(CryptoJS.enc.Utf8);

    const [userId, email_type_code, email_address] = decrypted.split(separator);
    return { userId, email_type_code, email_address };
};

const internals = {};

// GET ALL EMAILS
internals.get_all_emails = async function (request, h) {
    const credentials = request.auth.credentials;
    let email_list;
    try {
        await request.app.db
            .execute(
                `
                SELECT
                GOREMAL.GOREMAL_PIDM pidm ,
                GOREMAL.GOREMAL_EMAL_CODE email_type_code,
                MAIL_TYPE.TIPO_EMAIL_DESC email_type_description,
                GOREMAL.GOREMAL_EMAIL_ADDRESS email_address,
                GZWDATP.GZWDATP_ENTRY_DATE verification_entry_date,
                GZWDATP.GZWDATP_VALID_DATE verification_valid_date,
                CASE
                    WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                        THEN 'N'
                    ELSE 'Y'
                END is_verified,
                sysdate
            FROM GENERAL.GOREMAL
            JOIN table(SENATI.GWZGWWB.f_list_type_mail_tbl) MAIL_TYPE ON MAIL_TYPE.TIPO_EMAIL_CODE = GOREMAL.GOREMAL_EMAL_CODE
            LEFT JOIN SENATI.GZWDATP ON
                GZWDATP.GZWDATP_PIDM = GOREMAL.GOREMAL_PIDM
                AND GZWDATP.GZWDATP_VALUE = GOREMAL.GOREMAL_EMAIL_ADDRESS
                AND GZWDATP.GZWDATP_IND_DEL = 'N'
                AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
                --AND GZWDATP.GZWDATP_ENTRY_DATE >= GOREMAL.GOREMAL_ACTIVITY_DATE
            WHERE
            GOREMAL.GOREMAL_PIDM = :p_pidm
            AND GOREMAL_STATUS_IND ='A'
            AND GOREMAL_DISP_WEB_IND = 'Y'
    `,
                {
                    p_pidm: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        maxSize: 8,
                        val: credentials.pidm
                    }
                },
                { outFormat: oracledb.OBJECT }
            )
            .then(data => {
                email_list = data.rows.map(row => ({
                    email_id: make_encrypted_complex_id([
                        row["PIDM"],
                        row["EMAIL_TYPE_CODE"],
                        row["EMAIL_ADDRESS"]
                    ]),
                    email_type_code: row["EMAIL_TYPE_CODE"],
                    email_type_description: row["EMAIL_TYPE_DESCRIPTION"],
                    email_address: row["EMAIL_ADDRESS"],
                    verification_entry_date: row["VERIFICATION_ENTRY_DATE"],
                    verification_valid_date: row["VERIFICATION_VALID_DATE"],
                    is_verified: row["IS_VERIFIED"] === "Y"
                }));

            }).catch(e => {
                console.log(e);
                return e;
            });
        return email_list;
    }
    catch (e) {
        console.log(e)
    }
};

internals.get_type_email = function (request, h) {
    const credentials = request.auth.credentials;
    try {
        const response = request.app.db
            .execute(
                `SELECT * FROM table(SENATI.gwzgwwb.f_list_type_mail_tbl)`,
                {},
                { outFormat: oracledb.OBJECT }
            )
            .then(data => {
                return (
                    data.rows.map(row => {
                        return {
                            email_type_code: row["TIPO_EMAIL_CODE"],
                            email_type_description: row["TIPO_EMAIL_DESC"]
                        };
                    })
                );
            })
            .catch(e => {
                console.log(e);
                return e;

            });
        return response
    }
    catch (e) {
        console.log(e)
        // return e
    }

};
// GET EMAIL BY ID
internals.get_email_by_id = function (request, h) {
    const credentials = request.auth.credentials;
    const { email_id } = request.params;
    const { email_type_code, email_address } = decrypt_complex_id(email_id);
    try {
        const response = request.app.db
            .execute(
                `
                SELECT
                GOREMAL.GOREMAL_PIDM pidm ,
                GOREMAL.GOREMAL_EMAL_CODE email_type_code,
                MAIL_TYPE.TIPO_EMAIL_DESC email_type_description,
                GOREMAL.GOREMAL_EMAIL_ADDRESS email_address,
                GZWDATP.GZWDATP_ENTRY_DATE verification_entry_date,
                GZWDATP.GZWDATP_VALID_DATE verification_valid_date,
                CASE
                    WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                        THEN 'N'
                    ELSE 'Y'
                END is_verified,
                sysdate
            FROM GENERAL.GOREMAL
            JOIN table(SENATI.GWZGWWB.f_list_type_mail_tbl) MAIL_TYPE ON MAIL_TYPE.TIPO_EMAIL_CODE = GOREMAL.GOREMAL_EMAL_CODE
            LEFT JOIN SENATI.GZWDATP ON
                GZWDATP.GZWDATP_PIDM = GOREMAL.GOREMAL_PIDM
                AND GZWDATP.GZWDATP_VALUE = GOREMAL.GOREMAL_EMAIL_ADDRESS
                AND GZWDATP.GZWDATP_IND_DEL = 'N'
                AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
                --AND GZWDATP.GZWDATP_ENTRY_DATE >= GOREMAL.GOREMAL_ACTIVITY_DATE
            WHERE
            GOREMAL.GOREMAL_PIDM = :p_pidm
            AND GOREMAL.GOREMAL_EMAL_CODE = :email_type_code
            AND GOREMAL.GOREMAL_EMAIL_ADDRESS = :email_address
            AND GOREMAL_STATUS_IND ='A'
            AND GOREMAL_DISP_WEB_IND = 'Y'
`,
                {
                    p_pidm: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        maxSize: 8,
                        val: credentials.pidm
                    },
                    email_type_code: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        maxSize: 4,
                        val: email_type_code
                    },
                    email_address: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.STRING,
                        maxSize: 128,
                        val: email_address
                    }
                },
                { outFormat: oracledb.OBJECT }
            )
            .then(data => {
                if (data.rows.length === 0) {
                    return ({
                        error: {
                            message: "No se encontro el correo seleccionado"
                        }
                    });
                }
                const row = data.rows[0];
                const email = {
                    email_id,
                    email_type_code: row["EMAIL_TYPE_CODE"],
                    email_type_description: row["EMAIL_TYPE_DESCRIPTION"],
                    email_address: row["EMAIL_ADDRESS"],
                    verification_entry_date: row["VERIFICATION_ENTRY_DATE"],
                    verification_valid_date: row["VERIFICATION_VALID_DATE"],
                    is_verified: row["IS_VERIFIED"] === "Y"
                };
                return (email);
            })
            .catch(error => {
                console.log(error);
                return ({
                    error: {
                        message: error.message
                    }
                });
            });
        return response
    }
    catch (e) {
        console.log(e)
        //return e
    }
};

// ADD EMAIL
internals.add_email = async function (request, h) {
    const credentials = request.auth.credentials;
    const { email_address, email_type_code } = request.payload;
    const { db } = request.app;

    const has_email_format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email_address
    );

    if (!has_email_format) {
        return ({
            error: {
                message: `El correo '${email_address}' no tiene un formato valido`
            }
        });
    }

    const is_valid_email = Mailchecker.isValid(email_address);

    if (!is_valid_email) {
        return ({
            error: {
                message: `Lo sentimos, el correo '${email_address}' no es valido`
            }
        });
    }

    let has_duplicate = true;

    // SEARCH FOR DUPLICATES
    try {
        const query_search_duplicates = await db.execute(
            `
            SELECT
            COUNT(*) as count
        FROM GENERAL.GOREMAL
        JOIN table(SENATI.GWZGWWB.f_list_type_mail_tbl) MAIL_TYPE ON MAIL_TYPE.TIPO_EMAIL_CODE = GOREMAL.GOREMAL_EMAL_CODE
        WHERE GOREMAL.GOREMAL_PIDM = :p_pidm
            AND GOREMAL.GOREMAL_EMAL_CODE = :email_type_code
            AND GOREMAL.GOREMAL_EMAIL_ADDRESS = :email_address
            AND GOREMAL_STATUS_IND ='A'
            AND GOREMAL_DISP_WEB_IND = 'Y'
      `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: email_type_code
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 128,
                    val: email_address
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        has_duplicate = query_search_duplicates.rows[0]["COUNT"] > 0;
    } catch (error) {
        console.log("======= ADD_EMAIL: SEARCH_DUPLICATES =======");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message:
                    "No se pudo agregar el correo, porfavor intenta luego o envianos un correo app@senati.edu.pe"
            }
        });
    }

    if (has_duplicate) {
        return ({
            error: {
                message: `Ya tienes registrado el correo ${email_address}`
            }
        });
    }

    let is_already_verified = false;

    // SEARCH FOR DUPLICATES
    try {
        const query_search_verified = await db.execute(
            `
        SELECT
            COUNT(*) as count
        FROM SENATI.GZWDATP
        WHERE
            GZWDATP.GZWDATP_VALUE = :email_address
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            AND GZWDATP_VALID_DATE IS NOT NULL
      `,
            {
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 128,
                    val: email_address
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        is_already_verified = query_search_verified.rows[0]["COUNT"] > 0;
    } catch (error) {
        console.log("======= ADD_EMAIL: SEARCH_VERIFIED =======");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message:
                    "No se pudo agregar el correo, porfavor intenta luego o envianos un correo app@senati.edu.pe"
            }
        });
        //return false;
    }

    if (is_already_verified) {
        return ({
            error: {
                message: `Lo sentimos, el correo ${email_address} ya fue validado por otro usuario`
            }
        });
    }

    // INSERT IN DB
    try {
        const query_insert = await db.execute(
            `
        BEGIN
            SENATI.GWZGWWB.p_add_data(
                :p_pidm,
                :add_data_type,
                :email_address,
                :email_type_code
            );
            commit;
        END;
    `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                add_data_type: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "MAIL"
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 200,
                    val: email_address
                },
                email_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: email_type_code
                }
            }
        );
    } catch (error) {
        console.log("======= ADD_EMAIL: INSERT_ON_DB =======");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message: `No se pudo agregar el correo ${email_address}, por favor intenta luego o escribenos a app@senati.edu.pe`
            }
        });
    }

    //RETURN INSERTED DATA
    try {
        const query_search_by_email_address = await db.execute(
            `
            SELECT
            GOREMAL.GOREMAL_PIDM pidm ,
            GOREMAL.GOREMAL_EMAL_CODE email_type_code,
            MAIL_TYPE.TIPO_EMAIL_DESC email_type_description,
            GOREMAL.GOREMAL_EMAIL_ADDRESS email_address,
            CASE
                WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                    THEN 'N'
                ELSE 'Y'
            END is_verified,
            sysdate
        FROM GENERAL.GOREMAL
        JOIN table(SENATI.GWZGWWB.f_list_type_mail_tbl) MAIL_TYPE ON MAIL_TYPE.TIPO_EMAIL_CODE = GOREMAL.GOREMAL_EMAL_CODE
        LEFT JOIN SENATI.GZWDATP ON
            GZWDATP.GZWDATP_PIDM = GOREMAL.GOREMAL_PIDM
            AND GZWDATP.GZWDATP_VALUE = GOREMAL.GOREMAL_EMAIL_ADDRESS
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
            -- --AND GZWDATP.GZWDATP_ENTRY_DATE >= GOREMAL.GOREMAL_ACTIVITY_DATE
        WHERE
        GOREMAL.GOREMAL_PIDM = :p_pidm
        AND GOREMAL.GOREMAL_EMAL_CODE = :email_type_code
        AND GOREMAL.GOREMAL_EMAIL_ADDRESS = :email_address
        AND GOREMAL_STATUS_IND ='A'
        AND GOREMAL_DISP_WEB_IND = 'Y'
      `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: email_type_code
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 128,
                    val: email_address
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        const row = query_search_by_email_address.rows[0];
        const email = {
            email_id: make_encrypted_complex_id([
                row["PIDM"].toString(),
                row["EMAIL_TYPE_CODE"].toString(),
                row["EMAIL_ADDRESS"].toString()
            ]),
            email_type_code: row["EMAIL_TYPE_CODE"],
            email_type_description: row["EMAIL_TYPE_DESCRIPTION"],
            email_address: row["EMAIL_ADDRESS"],
            is_verified: row["IS_VERIFIED"] === "Y"
        };
        return h.response(email).code(201);
    } catch (e) {
        console.log("======= ADD_EMAIL: RETURN_INSERTED_DATA =======");
        console.log(e);
        console.log("====================================");
        return ({
            error: {
                message: e.message
            }
        });
    }
};

// DELETE EMAIL
internals.delete_email_by_id = async function (request, h) {
    const { db } = request.app;
    const { credentials } = request.auth;
    const { email_id } = request.params;
    const { email_type_code, email_address } = decrypt_complex_id(email_id);

    const email = { email_id };

    // GET EMAIL BY ID
    try {
        const query_search_by_id = await db.execute(
            `
            SELECT
            GOREMAL.GOREMAL_PIDM pidm ,
            GOREMAL.GOREMAL_EMAL_CODE email_type_code,
            MAIL_TYPE.TIPO_EMAIL_DESC email_type_description,
            GOREMAL.GOREMAL_EMAIL_ADDRESS email_address,
            CASE
                WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                    THEN 'N'
                ELSE 'Y'
            END is_verified
        FROM GENERAL.GOREMAL
        JOIN table(SENATI.GWZGWWB.f_list_type_mail_tbl) MAIL_TYPE ON MAIL_TYPE.TIPO_EMAIL_CODE = GOREMAL.GOREMAL_EMAL_CODE
        LEFT JOIN SENATI.GZWDATP ON
            GZWDATP.GZWDATP_PIDM = GOREMAL.GOREMAL_PIDM
            AND GZWDATP.GZWDATP_VALUE = GOREMAL.GOREMAL_EMAIL_ADDRESS
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
            --AND GZWDATP.GZWDATP_ENTRY_DATE >= GOREMAL.GOREMAL_ACTIVITY_DATE
        WHERE
            GOREMAL.GOREMAL_PIDM = :p_pidm
            AND GOREMAL.GOREMAL_EMAL_CODE = :email_type_code
            AND GOREMAL.GOREMAL_EMAIL_ADDRESS = :email_address
            AND GOREMAL_STATUS_IND ='A'
            AND GOREMAL_DISP_WEB_IND = 'Y'
      `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 140,
                    val: email_address
                },
                email_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: email_type_code
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        if (query_search_by_id.rows.length === 0) {
            return ({
                error: {
                    message: "No se encontro el correo seleccionado"
                }
            });
        }
        const row = query_search_by_id.rows[0];
        email.email_address = row["EMAIL_ADDRESS"];
        email.email_type_code = row["EMAIL_TYPE_CODE"];
    } catch (error) {
        console.log("======= DELETE_EMAIL: GET_EMAIL_BY_ID =======");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message: error.message
            }
        });
    }

    // DELETE EMAIL
    try {
        console.log('try')
        const query_delete_email = await request.app.db.execute(
            `BEGIN
              SENATI.GWZGWWB.p_del_correo(
                  :p_pidm,
                  :email_address,
                  :email_type_code
          );
          COMMIT;
      END;`,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 9,
                    val: email.email_address
                },
                email_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: email.email_type_code
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        return (email);
    } catch (error) {
        console.log("======= DELETE_EMAIL: DELETE_EMAIL=======");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message: error.message
            }
        });
    }
};

// SEND VERIFICATION CODE
internals.send_verification_code = async function (request, h) {
    const { credentials } = request.auth;
    const { email_id } = request.params;
    const { email_type_code, email_address } = decrypt_complex_id(email_id);

    const email = {
        email_id,
        email_type_code,
        email_address
    };

    let server_current_time;

    //GET EMAIL
    try {
        const query_search_email_by_id = await request.app.db.execute(
            `
            SELECT *
            FROM (
              SELECT
                  GOREMAL.GOREMAL_PIDM pidm ,
                  GOREMAL.GOREMAL_EMAL_CODE email_type_code,
                  MAIL_TYPE.TIPO_EMAIL_DESC email_type_description,
                  GOREMAL.GOREMAL_EMAIL_ADDRESS email_address,
                  GOREMAL.GOREMAL_PIDM verification_pidm,
                  GZWDATP.GZWDATP_ENTRY_DATE verification_entry_date,
                  GZWDATP.GZWDATP_VALID_DATE verification_valid_date,
                  SYSDATE server_current_time,
                  CASE
                      WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                          THEN 'N'
                      ELSE 'Y'
                  END is_verified
              FROM GENERAL.GOREMAL
              JOIN table(SENATI.GWZGWWB.f_list_type_mail_tbl) MAIL_TYPE ON MAIL_TYPE.TIPO_EMAIL_CODE = GOREMAL.GOREMAL_EMAL_CODE
              LEFT JOIN SENATI.GZWDATP ON
                  GZWDATP.GZWDATP_VALUE = GOREMAL.GOREMAL_EMAIL_ADDRESS
                  AND GZWDATP.GZWDATP_IND_DEL = 'N'
              WHERE
                  GOREMAL.GOREMAL_PIDM = :p_pidm
                  AND GOREMAL.GOREMAL_EMAL_CODE = :email_type_code
                  AND GOREMAL.GOREMAL_EMAIL_ADDRESS = :email_address
                  AND GOREMAL_STATUS_IND ='A'
                  AND GOREMAL_DISP_WEB_IND = 'Y'
              ORDER BY GZWDATP.GZWDATP_ENTRY_DATE DESC
            )
            WHERE ROWNUM = 1`,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: email.email_type_code
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 140,
                    val: email.email_address
                }
            },
            { outFormat: oracledb.OBJECT }
        );

        if (query_search_email_by_id.rows.length === 0) {
            return ({
                error: {
                    message: "No se econtro el correo registrado"
                }
            });
        }

        const row = query_search_email_by_id.rows[0];
        email.email_address = row["EMAIL_ADDRESS"];
        email.is_verified = row["IS_VERIFIED"] === "Y";
        email.verification_pidm = row["VERIFICATION_PIDM"];
        email.verification_entry_date = row["VERIFICATION_ENTRY_DATE"];
        email.verification_valid_date = row["VERIFICATION_VALID_DATE"];
        server_current_time = row["SERVER_CURRENT_TIME"];
    } catch (error) {
        console.log("======= SEND_VERIFICATION_CODE: GET_EMAIL =======");
        console.log(error);
        console.log("====================================");

        return ({
            error: {
                message: error.message
            }
        });
    }

    // Check if email is already verified
    if (email.is_verified) {
        return ({
            error: {
                type: "ALREADY_VERIFIED",
                message: `El correo ${
                    email.email_address
                    } ya fue verificado por otro usuario`
            }
        });
    }

    if (email.is_verified) {
        return ({
            error: {
                type: "ALREADY_VERIFIED",
                message: `El correo ${email.email_address} ya fue verificado`
            }
        });
    }

    // If has verification_entry_date means is retry
    const is_retry =
        email.verification_entry_date !== null &&
        email.verification_pidm === credentials.pidm;
    const retry_time = VERIFICATION_CODE_MINIMUM_RETRY_TIME;

    try {
        if (is_retry) {
            const retry_countdown =
                Math.abs(email.verification_entry_date.getTime() + retry_time) -
                server_current_time.getTime();

            const retry_countdown_seconds = Math.ceil(retry_countdown / 1000);
            const retry_countdown_minutes = Math.ceil(retry_countdown / (60 * 1000));

            // Check if has elapsed 5 minutes from last try
            if (retry_countdown > 0 && process.env.NODE_ENV !== "test") {
                return ({
                    error: {
                        type: "MINIMUM_RETRY_TIME",
                        message:
                            retry_countdown_seconds < 60
                                ? `Espera ${retry_countdown_seconds} segundos para volver a intentar`
                                : `Espera ${retry_countdown_minutes} minutos para volver a intentar`
                    }
                });
            }
        }
    } catch (error) {
        console.log("========== send_verification_code: retry error ===========");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message: "No se pudo enviar el mensaje"
            }
        });
    }

    // Generate a random six digits number
    const verification_code = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    // Send email
    try {
        const mail_api = new MailGun({
            apiKey: process.env.MAIL_GUN_TOKEN,
            domain: process.env.MAIL_GUN_DOMAIN
        });

        const htmlTemplate = require("./template");

        const options = {
            from: process.env.MAIL_GUN_FROM || "app@senati.edu.pe",
            to: email.email_address,
            subject: "SENATI: Tu código de verificación",
            html: htmlTemplate.replace("%CODE_EMAIL%", `${verification_code}`)
        };

        let send_message;
        try {
            if (process.env.NODE_ENV === "test") {
                send_message = true;
            }
            else {
                send_message = await new Promise((resolve, reject) => {
                    mail_api.messages().send(options, (error, body) => {
                        if (error || body === undefined) {
                            console.log("======= Error: send_message =======");
                            console.log(error);
                            console.log("===============================");
                            resolve({
                                error: {
                                    message:
                                        "No se pudo enviar el correo, por favor intenta mas tarde"
                                }
                            });
                        }
                        resolve({ was_sent: true });
                    });
                });

            }



        } catch (error) {
            console.log(error)
            return ({
                error: {
                    message: "No se pudo enviar el correo, por favor intenta mas tarde"
                }
            });
        }

        if (send_message.error) {
            return (send_message);
        }

        const insert_verification = await request.app.db.execute(
            `
          BEGIN
              SENATI.GWZGWWB.p_create_cod_verif(
                  :p_pidm,
                  :email_address,
                  :verification_data_type,
                  :verification_code,
                  :result
              );
              COMMIT;
          END;
      `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 9,
                    val: email.email_address
                },
                verification_data_type: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: "MAIL"
                },
                verification_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 6,
                    val: verification_code
                },
                result: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.STRING
                }
            }
        );

        if (process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "test") {
            email.verification_code = verification_code;
        }
        email.verification_entry_date = server_current_time;
        return (email);
    } catch (error) {
        console.log("====== Error: insert_verification ======");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message: "No se pudo enviar el mensaje"
            }
        });
    }
};

internals.validate_verification_code = async function (request, h) {
    const { credentials } = request.auth;
    const { email_id } = request.params;
    const { email_type_code, email_address } = decrypt_complex_id(email_id);

    const email = {
        email_id,
        email_type_code,
        email_address
    };

    let server_current_time;
    let verification_code;

    //GET EMAIL
    try {
        const query_search_email_by_id = await request.app.db.execute(
            `
            SELECT *
            FROM (
              SELECT
                  GOREMAL.GOREMAL_PIDM pidm ,
                  GOREMAL.GOREMAL_EMAL_CODE email_type_code,
                  MAIL_TYPE.TIPO_EMAIL_DESC email_type_description,
                  GOREMAL.GOREMAL_EMAIL_ADDRESS email_address,
                  GZWDATP.GZWDATP_ENTRY_DATE verification_entry_date,
                  GZWDATP.GZWDATP_VALID_DATE verification_valid_date,
                  GZWDATP.GZWDATP_VALID_CODE verification_code,
                  SYSDATE server_current_time,
                  CASE
                      WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                          THEN 'N'
                      ELSE 'Y'
                  END is_verified
              FROM GENERAL.GOREMAL
              JOIN table(SENATI.GWZGWWB.f_list_type_mail_tbl) MAIL_TYPE ON MAIL_TYPE.TIPO_EMAIL_CODE = GOREMAL.GOREMAL_EMAL_CODE
              LEFT JOIN SENATI.GZWDATP ON
                  GOREMAL.GOREMAL_PIDM = GZWDATP.GZWDATP_PIDM
                  AND GZWDATP.GZWDATP_VALUE = GOREMAL.GOREMAL_EMAIL_ADDRESS
                  AND GZWDATP.GZWDATP_IND_DEL = 'N'
                  --AND GZWDATP.GZWDATP_ENTRY_DATE >= GOREMAL.GOREMAL_ACTIVITY_DATE
              WHERE
                  GOREMAL.GOREMAL_PIDM = :p_pidm
                  AND GOREMAL.GOREMAL_EMAL_CODE = :email_type_code
                  AND GOREMAL.GOREMAL_EMAIL_ADDRESS = :email_address
                  AND GOREMAL_STATUS_IND ='A'
                  AND GOREMAL_DISP_WEB_IND = 'Y'
              ORDER BY GZWDATP.GZWDATP_ENTRY_DATE DESC
            )
            WHERE ROWNUM = 1`,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: email.email_type_code
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 140,
                    val: email.email_address
                }
            },
            { outFormat: oracledb.OBJECT }
        );

        if (query_search_email_by_id.rows.length === 0) {
            return ({
                error: {
                    message: "No se econtro el correo registrado"
                }
            });
        }

        const row = query_search_email_by_id.rows[0];
        email.email_address = row["EMAIL_ADDRESS"];
        email.is_verified = row["IS_VERIFIED"] === "Y";
        email.verification_entry_date = row["VERIFICATION_ENTRY_DATE"];
        email.verification_valid_date = row["VERIFICATION_VALID_DATE"];
        verification_code = row["VERIFICATION_CODE"];
        server_current_time = row["SERVER_CURRENT_TIME"];
    } catch (error) {
        console.log("======= ADD_EMAIL: RETURN_INSERTED_DATA =======");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message: error.message
            }
        });
    }

    // Check if is already verified
    if (email.verification_entry_date === null) {
        return ({
            error: {
                message: `El correo ${
                    email.email_address
                    } no tiene asociado ningun codigo de validacion`
            }
        });
    }

    if (email.is_verified) {
        return ({
            error: {
                message: `El correo ${email.email_address} ya fue verificado`
            }
        });
    }

    // Check for expired code;
    const elapsed_time =
        server_current_time.getTime() - email.verification_entry_date.getTime();
    if (elapsed_time > VERIFICATION_CODE_EXPIRATION_TIME) {
        return ({
            error: {
                message:
                    "El codigo de verificacion a expirado, por favor genere uno nuevo"
            }
        });
    }

    // Check verification code
    if (verification_code !== request.payload.verification_code) {
        return ({
            error: {
                message: "El codigo de verificacion ingresado no es correcto"
            }
        });
    }

    // Insert validation on database
    try {
        const query_validate_verification_code = await request.app.db.execute(
            `
          BEGIN
              SENATI.GWZGWWB.p_validate_code_verif(
                  :p_pidm,
                  :email_address,
                  :verification_type,
                  :verification_code
              );
          commit;
          END;`,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                email_address: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 140,
                    val: email.email_address
                },
                verification_type: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: "MAIL"
                },
                verification_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 6,
                    val: request.payload.verification_code
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        email.is_verified = true;
        email.verification_valid_date = server_current_time;

        return (email);
    } catch (error) {
        console.log("====== query_validate_verification_code ======");
        console.log(error);
        console.log("=========================");
        return ({
            error: {
                message:
                    "No se pudo validar en telefono, por favor intenta de nuevo mas tarde"
            }
        });
    }
};
module.exports = internals;
