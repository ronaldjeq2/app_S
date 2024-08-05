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

const CryptoJS = require("crypto-js");

const crypto_key = `S343CbpaEB@R*^-G`;
const separator = ";";

const make_encrypted_complex_id = complex_id_array => {
    const complexId = complex_id_array.join(separator);
    return encodeURIComponent(
        CryptoJS.AES.encrypt(complexId, crypto_key).toString()
    );
};

const decrypt_complex_id = phone_id => {
    const decrypted = CryptoJS.AES.decrypt(
        decodeURIComponent(phone_id),
        crypto_key
    ).toString(CryptoJS.enc.Utf8);

    const [userId, phone_type_code, sequence] = decrypted.split(separator);
    return { userId, phone_type_code, sequence: parseInt(sequence) };
};

const internals = {};

// GET ALL PHONES
internals.get_all_phones = async function (request, h) {
    const credentials = request.auth.credentials;
    let phone_list;
    try {
        await request.app.db
            .execute(
                `
        SELECT
            SPRTELE.SPRTELE_PIDM pidm,
            SPRTELE.SPRTELE_SEQNO sequence,
            SPRTELE.SPRTELE_TELE_CODE phone_type_code,
            SPRTELE.SPRTELE_PHONE_NUMBER phone_number,
            CASE
                WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                    THEN 'N'
                ELSE 'Y'
            END is_verified,
            SYSDATE
        FROM SPRTELE
        LEFT JOIN SENATI.GZWDATP ON
            SPRTELE.SPRTELE_PIDM = GZWDATP.GZWDATP_PIDM
            AND GZWDATP.GZWDATP_VALUE = SPRTELE.SPRTELE_PHONE_NUMBER
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
            --AND GZWDATP.GZWDATP_ENTRY_DATE >= SPRTELE.SPRTELE_ACTIVITY_DATE
        WHERE SPRTELE_PIDM = :p_pidm
            AND SPRTELE_TELE_CODE = 'CE'
            AND SPRTELE_STATUS_IND IS NULL
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
                phone_list = data.rows.map(row => ({

                    phone_id: make_encrypted_complex_id([
                        row["PIDM"].toString(),
                        row["PHONE_TYPE_CODE"].toString(),
                        row["SEQUENCE"].toString()
                    ]),
                    phone_number: row["PHONE_NUMBER"],
                    phone_type_code: row["PHONE_TYPE_CODE"],
                    sequence: row["SEQUENCE"],
                    is_verified: row["IS_VERIFIED"] === "Y",
                }));
            }).catch(e => {

                console.log(e);
            });

        return phone_list
    }
    catch (e) {
        console.log(e);
        return e
    }
};

// GET PHONE BY ID
internals.get_phone_by_id = async function (request, h) {
    const credentials = request.auth.credentials;
    const { phone_id } = request.params;
    const { phone_type_code, sequence } = decrypt_complex_id(phone_id);
    try {
        const phone = request.app.db
            .execute(
                `
  SELECT
    SPRTELE.SPRTELE_PIDM pidm,
    SPRTELE.SPRTELE_SEQNO sequence,
    SPRTELE.SPRTELE_TELE_CODE phone_type_code,
    SPRTELE.SPRTELE_PHONE_NUMBER phone_number,
    CASE
        WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
            THEN 'N'
        ELSE 'Y'
    END is_verified,
    SYSDATE
  FROM SPRTELE
  LEFT JOIN SENATI.GZWDATP ON
      SPRTELE.SPRTELE_PIDM = GZWDATP.GZWDATP_PIDM
      AND GZWDATP.GZWDATP_VALUE = SPRTELE.SPRTELE_PHONE_NUMBER
      AND GZWDATP.GZWDATP_IND_DEL = 'N'
      AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
      --AND GZWDATP.GZWDATP_ENTRY_DATE >= SPRTELE.SPRTELE_ACTIVITY_DATE
  WHERE SPRTELE_PIDM = :p_pidm
    AND SPRTELE.SPRTELE_SEQNO = :sequence
    AND SPRTELE_TELE_CODE = 'CE'
    AND SPRTELE_STATUS_IND IS NULL
`,
                {
                    p_pidm: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        maxSize: 8,
                        val: credentials.pidm
                    },
                    sequence: {
                        dir: oracledb.BIND_IN,
                        type: oracledb.NUMBER,
                        maxSize: 8,
                        val: sequence
                    }
                },
                { outFormat: oracledb.OBJECT }
            )
            .then(data => {
                if (data.rows.length === 0) {
                    return ({
                        error: {
                            message: "No se encontro el teléfono seleccionado"
                        }
                    });
                }
                const row = data.rows[0];
                return {
                    phone_id,
                    phone_number: row["PHONE_NUMBER"],
                    phone_type_code: row["PHONE_TYPE_CODE"],
                    sequence: row["SEQUENCE"],
                    is_verified: row["IS_VERIFIED"] === "Y"
                };
            })
            .catch(error => {
                console.log(error)
                return ({
                    error: {
                        message: error.message
                    }
                });
            });
        return phone
    }
    catch (e) {
        console.log(e);
        return e
    }
};

// ADD PHONE
internals.add_phone = async function (request, h) {
    const credentials = request.auth.credentials;
    const { phone_number } = request.payload;
    const { db } = request.app;

    const has_cell_phone_format = /^9[0-9]{8}$/.test(phone_number);

    if (!has_cell_phone_format) {
        return ({
            error: {
                message: `El número '${phone_number}' no tiene un formato de celular valido`
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
        FROM SPRTELE
        WHERE SPRTELE_PIDM = :p_pidm
        AND SPRTELE.SPRTELE_PHONE_NUMBER = :phone_number
        AND SPRTELE_TELE_CODE='CE'
        AND SPRTELE_STATUS_IND is null
    `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                phone_number: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 9,
                    val: phone_number
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        has_duplicate = query_search_duplicates.rows[0]["COUNT"] > 0;
    } catch (e) {
        console.log(e)
        return ({
            error: {
                message: e.message
            }
        });
    }

    if (has_duplicate) {
        return ({
            error: {
                message: "Ya tienes ese número registrado"
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
            GZWDATP.GZWDATP_VALUE = :phone_number
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            AND GZWDATP_VALID_DATE IS NOT NULL
      `,
            {
                phone_number: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 128,
                    val: phone_number
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
                    "No se pudo agregar el correo, por favor intenta luego o envianos un correo app@senati.edu.pe"
            }
        });
    }

    if (is_already_verified) {
        return ({
            error: {
                message: `Lo sentimos, el teléfono ${phone_number} ya fue validado por otro usuario`
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
                :phone_number,
                :phone_type_code
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
                    val: "TELF"
                },
                phone_number: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 200,
                    val: phone_number
                },
                phone_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: "CE"
                }
            }
        );
    } catch (error) {
        console.log(error)

        return ({
            error: {
                message:
                    "No se pudo agregar el número, porfavor intenta luego o envianos un correo app@senati.edu.pe"
            }
        });
    }

    //RETURN INSERTED DATA
    try {
        const query_search_by_phone_number = await db.execute(
            `
        SELECT
            SPRTELE.SPRTELE_PIDM pidm,
            SPRTELE.SPRTELE_SEQNO sequence,
            SPRTELE.SPRTELE_TELE_CODE phone_type_code,
            SPRTELE.SPRTELE_PHONE_NUMBER phone_number,
            CASE
                WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                    THEN 'N'
                ELSE 'Y'
            END is_verified,
            SYSDATE
        FROM SPRTELE
        LEFT JOIN SENATI.GZWDATP ON
            SPRTELE.SPRTELE_PIDM = GZWDATP.GZWDATP_PIDM
            AND GZWDATP.GZWDATP_VALUE = SPRTELE.SPRTELE_PHONE_NUMBER
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
            --AND GZWDATP.GZWDATP_ENTRY_DATE >= SPRTELE.SPRTELE_ACTIVITY_DATE
        WHERE SPRTELE_PIDM = :p_pidm
            AND SPRTELE.SPRTELE_PHONE_NUMBER = :phone_number
            AND SPRTELE_TELE_CODE = 'CE'
            AND SPRTELE_STATUS_IND IS NULL
      `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                phone_number: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 200,
                    val: phone_number
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        const row = query_search_by_phone_number.rows[0];
        const phone = {
            phone_id: make_encrypted_complex_id([
                row["PIDM"].toString(),
                row["PHONE_TYPE_CODE"].toString(),
                row["SEQUENCE"].toString()
            ]),
            phone_number: row["PHONE_NUMBER"],
            phone_type_code: row["PHONE_TYPE_CODE"],
            sequence: row["SEQUENCE"],
            is_verified: row["IS_VERIFIED"] === "Y"
        };
        return h.response(phone).code(201);
    } catch (e) {
        console.log(e)
        return ({
            error: {
                message: e.message
            }
        });
    }
};

// DELETE PHONE
internals.delete_phone_by_id = async function (request, h) {
    const { db } = request.app;
    const { credentials } = request.auth;
    const { phone_id } = request.params;
    const { phone_type_code, sequence } = decrypt_complex_id(phone_id);

    const phone = { phone_id };

    // GET PHONE BY ID
    try {
        const query_search_by_id = await db.execute(
            `
      SELECT
            SPRTELE.SPRTELE_PIDM pidm,
            SPRTELE.SPRTELE_SEQNO sequence,
            SPRTELE.SPRTELE_TELE_CODE phone_type_code,
            SPRTELE.SPRTELE_PHONE_NUMBER phone_number,
            CASE
                WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                    THEN 'N'
                ELSE 'Y'
            END is_verified,
            SYSDATE
        FROM SPRTELE
        LEFT JOIN SENATI.GZWDATP ON
            SPRTELE.SPRTELE_PIDM = GZWDATP.GZWDATP_PIDM
            AND GZWDATP.GZWDATP_VALUE = SPRTELE.SPRTELE_PHONE_NUMBER
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            AND GZWDATP.GZWDATP_VALID_DATE IS NOT NULL
            --AND GZWDATP.GZWDATP_ENTRY_DATE >= SPRTELE.SPRTELE_ACTIVITY_DATE
        WHERE SPRTELE_PIDM = :p_pidm
            AND SPRTELE.SPRTELE_SEQNO = :sequence
            AND SPRTELE_TELE_CODE = :phone_type_code
            AND SPRTELE_STATUS_IND is null
      `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                sequence: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: sequence
                },
                phone_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    val: "CE"
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        if (query_search_by_id.rows.length === 0) {
            return ({
                error: {
                    message: "No se encontro el teléfono seleccionado"
                }
            });
        }
        const row = query_search_by_id.rows[0];
        phone.phone_number = row["PHONE_NUMBER"];
        phone.phone_type_code = row["PHONE_TYPE_CODE"];
        phone.sequence = row["SEQUENCE"];
        phone.is_verified = row["IS_VERIFIED"] === "Y";
    } catch (error) {
        console.log(error)
        return ({
            error: {
                message: error.message
            }
        });
    }

    // DELETE PHONE
    try {
        const query_delete_phone = await request.app.db.execute(
            `BEGIN
              SENATI.GWZGWWB.p_del_telf(
                  :p_pidm,
                  :phone_number,
                  :phone_type_code,
                  :sequence
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
                phone_number: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 9,
                    val: phone.phone_number
                },
                phone_type_code: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: phone.phone_type_code
                },
                sequence: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: phone.sequence
                }
            },
            { outFormat: oracledb.OBJECT }
        );
        return (phone);
    } catch (error) {
        console.log(error)
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
    const { phone_id } = request.params;
    const { phone_type_code, sequence } = decrypt_complex_id(phone_id);

    const phone = {
        phone_id: phone_id,
        type_code: phone_type_code,
        sequence
    };
    let server_current_time;

    //GET PHONE NUMBER
    try {
        const query_search_phone_by_id = await request.app.db.execute(
            `
      SELECT *
      FROM (
        SELECT
            SPRTELE.SPRTELE_PIDM pidm,
            SPRTELE.SPRTELE_SEQNO seqno,
            SPRTELE.SPRTELE_TELE_CODE tele_code,
            SPRTELE.SPRTELE_PHONE_NUMBER phone_number,
            GZWDATP.GZWDATP_PIDM verification_pidm,
            GZWDATP.GZWDATP_ENTRY_DATE verification_entry_date,
            GZWDATP.GZWDATP_VALID_DATE verification_valid_date,
            SYSDATE server_current_time,
            CASE
                WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                    THEN 'N'
                ELSE 'Y'
            END is_verified
        FROM sprtele
        LEFT JOIN SENATI.GZWDATP ON
            GZWDATP.GZWDATP_VALUE = sprtele.SPRTELE_PHONE_NUMBER
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
        WHERE sprtele_pidm = :p_pidm
        AND sprtele.SPRTELE_SEQNO = :sequence
        AND SPRTELE_TELE_CODE = 'CE'
        AND SPRTELE_STATUS_IND is null
        ORDER BY GZWDATP.GZWDATP_ENTRY_DATE DESC
      )
      WHERE ROWNUM = 1
    `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                sequence: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: phone.sequence
                }
            },
            { outFormat: oracledb.OBJECT }
        );

        if (query_search_phone_by_id.rows.length === 0) {
            return ({
                error: {
                    message: "No se econtro el teléfono registrado"
                }
            });
        }
        const row = query_search_phone_by_id.rows[0];

        phone.phone_number = row["PHONE_NUMBER"];
        phone.verification_pidm = row["VERIFICATION_PIDM"];
        phone.verification_entry_date = row["VERIFICATION_ENTRY_DATE"];
        phone.verification_valid_date = row["VERIFICATION_VALID_DATE"];
        phone.is_verified = row["IS_VERIFIED"] === "Y";
        server_current_time = row["SERVER_CURRENT_TIME"];
    } catch (error) {
        return ({
            error: {
                message: error.message
            }
        });
    }

    // Check if phone is already verified
    if (phone.is_verified && phone.verification_pidm !== credentials.pidm) {
        return ({
            error: {
                type: "ALREADY_VERIFIED",
                message: `El número de teléfono ${
                    phone.phone_number
                    } ya fue verificado por otro usuario`
            }
        });
    }

    if (phone.is_verified) {
        return ({
            error: {
                type: "ALREADY_VERIFIED",
                message: `El número de teléfono ${phone.phone_number} ya fue verificado`
            }
        });
    }

    // If has verification_entry_date means is retry
    const is_retry =
        phone.verification_entry_date !== null &&
        phone.verification_pidm === credentials.pidm;
    const retry_time = VERIFICATION_CODE_MINIMUM_RETRY_TIME;

    try {
        if (is_retry && process.env.NODE_ENV !== "test") {
            const retry_countdown =
                Math.abs(phone.verification_entry_date.getTime() + retry_time) -
                server_current_time.getTime();

            const retry_countdown_seconds = Math.ceil(retry_countdown / 1000);
            const retry_countdown_minutes = Math.ceil(retry_countdown / (60 * 1000));

            // Check if has elapsed 5 minutes from last try
            if (retry_countdown > 0) {
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

    // Send sms code
    try {
        if (process.env.NODE_ENV !== "DEV" && process.env.NODE_ENV !== "test") {
            const request_send_sms = await RequestPromise({
                url: process.env.URL_INFO_BIP,
                method: "POST",
                headers: {
                    Authorization: `Basic ${process.env.TOKEN_INFO_BIP}`
                },
                body: JSON.stringify({
                    to: `51${phone.phone_number}`,
                    text: `SENATI: Tu código de verificación es ${verification_code}`
                })
            });

            const parsed_request = JSON.parse(request_send_sms);

            // When sending SMS messages, Infobip API returns the response with status PENDING_ACCEPTED
            // More info on https://dev.infobip.com/send-sms/single-sms-message#section-status
            const request_send_sms_success =
                parsed_request["messages"] &&
                parsed_request["messages"][0] &&
                parsed_request["messages"][0]["status"] &&
                parsed_request["messages"][0]["status"]["groupId"] === 1;

            if (!request_send_sms_success) {
                console.log("======== < request_send_sms > ========");
                console.log(parsed_request);
                console.log("======== </ request_send_sms > ========");
                return ({
                    error: {
                        message: "No se pudo enviar el mensaje"
                    }
                });
            }
        }

        const insert_verification = await request.app.db.execute(
            `
        BEGIN
            SENATI.GWZGWWB.p_create_cod_verif(
                :p_pidm,
                :phone_number,
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
                phone_number: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 9,
                    val: phone.phone_number
                },
                verification_data_type: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: "TELF"
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
            phone.verification_code = verification_code;
        }

        phone.verification_entry_date = server_current_time;
        return (phone);
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
    const { phone_id } = request.params;
    const { phone_type_code, sequence } = decrypt_complex_id(phone_id);

    const phone = {
        id: phone_id,
        type_code: phone_type_code,
        sequence
    };
    let server_current_time, verification_valid_code;

    //GET PHONE NUMBER
    try {
        const query_search_phone_by_id = await request.app.db.execute(
            `
      SELECT *
      FROM (
        SELECT
            SPRTELE.SPRTELE_PIDM pidm,
            SPRTELE.SPRTELE_SEQNO seqno,
            SPRTELE.SPRTELE_TELE_CODE tele_code,
            SPRTELE.SPRTELE_PHONE_NUMBER phone_number,
            GZWDATP.GZWDATP_ENTRY_DATE verification_entry_date,
            GZWDATP.GZWDATP_VALID_DATE verification_valid_date,
            GZWDATP.GZWDATP_VALID_CODE verification_valid_code,
            SYSDATE server_current_time,
            CASE
                WHEN GZWDATP.GZWDATP_VALID_DATE IS NULL
                    THEN 'N'
                ELSE 'Y'
            END is_verified
        FROM sprtele
        LEFT JOIN SENATI.GZWDATP ON
            sprtele.SPRTELE_PIDM = GZWDATP.GZWDATP_PIDM
            AND GZWDATP.GZWDATP_VALUE = sprtele.SPRTELE_PHONE_NUMBER
            AND GZWDATP.GZWDATP_IND_DEL = 'N'
            --AND GZWDATP.GZWDATP_ENTRY_DATE >= SPRTELE.SPRTELE_ACTIVITY_DATE
        WHERE sprtele_pidm = :p_pidm
        AND sprtele.SPRTELE_SEQNO = :sequence
        AND SPRTELE_TELE_CODE = 'CE'
        AND SPRTELE_STATUS_IND is null
        ORDER BY GZWDATP.GZWDATP_ENTRY_DATE DESC
      )
      WHERE ROWNUM = 1
    `,
            {
                p_pidm: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: credentials.pidm
                },
                sequence: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.NUMBER,
                    maxSize: 8,
                    val: phone.sequence
                }
            },
            { outFormat: oracledb.OBJECT }
        );

        if (query_search_phone_by_id.rows.length === 0) {
            return ({
                error: {
                    message: "No se econtró el teléfono registrado"
                }
            });
        }

        const row = query_search_phone_by_id.rows[0];
        phone.phone_number = row["PHONE_NUMBER"];
        phone.is_verified = row["IS_VERIFIED"] === "Y";
        phone.verification_entry_date = row["VERIFICATION_ENTRY_DATE"];
        phone.verification_valid_date = row["VERIFICATION_VALID_DATE"];

        verification_valid_code = row["VERIFICATION_VALID_CODE"];
        server_current_time = row["SERVER_CURRENT_TIME"];
    } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        return ({
            error: {
                message: error.message
            }
        });
    }

    // Check if is already verified
    if (phone.verification_entry_date === null) {
        return ({
            error: {
                message: `El número de teléfono ${
                    phone.phone_number
                    } no tiene asociado ningun codigo de validacion`
            }
        });
    }

    if (phone.is_verified) {
        return ({
            error: {
                message: `El número de teléfono ${phone.phone_number} ya fue verificado`
            }
        });
    }

    // Check for expired code;
    const elapsed_time =
        server_current_time.getTime() - phone.verification_entry_date.getTime();
    if (elapsed_time > VERIFICATION_CODE_EXPIRATION_TIME) {
        return ({
            error: {
                message:
                    "El codigo de verificacion a expirado, por favor genere uno nuevo"
            }
        });
    }

    // Check verification code
    if (verification_valid_code !== request.payload.verification_code) {
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
                :phone_number,
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
                phone_number: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 9,
                    val: phone.phone_number
                },
                verification_type: {
                    dir: oracledb.BIND_IN,
                    type: oracledb.STRING,
                    maxSize: 4,
                    val: "TELF"
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
        phone.is_verified = true;
        phone.verification_valid_date = server_current_time;
        return (phone);
    } catch (error) {
        console.log("====== query_validate_verification_code ======");
        console.log(error);
        console.log("=========================");
        return ({
            error: {
                message:
                    "No se pudo validar en teléfono, por favor intenta de nuevo mas tarde"
            }
        });
    }
};
module.exports = internals;
