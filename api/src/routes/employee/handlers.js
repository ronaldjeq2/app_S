/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
"use strict";
const Boom = require("boom");
const oracledb = require("oracledb");

var _ = require("lodash");

let internals = {};
/**
 * ## restrictedArea - you can only reach here if you've passed
 * authentication
 *
 * note: the user name is available from the credentials!
 */

internals.getEmployeePhoto = function (request, h) {
    const credentials = request.auth.credentials;
    const idEmpleado = credentials.pidm;
    try {

        if (request.params.userId !== credentials.pid) {
            return (Boom.unauthorized("El userId no corresponde con la llave de acceso"));
        } else {
            const response = request.app.db
                .execute(
                    ...[
                        `
          SELECT
              SZRFOTO_FOTO
            FROM 
              SENATI.SZRFOTO 
            WHERE 
              SZRFOTO_PIDM = :idAlumno 
              AND (SZRFOTO_TIPO = 'C' or SZRFOTO_TIPO = 'R' )
              AND ROWNUM = 1
        `,
                        {
                            idAlumno: {
                                dir: oracledb.BIND_IN,
                                type: oracledb.NUMBER,
                                val: idEmpleado
                            }
                        },
                        { outFormat: oracledb.OBJECT }
                    ]
                )

                .then(data => {
                    if (data.rows.length === 0 || data.rows[0] === undefined) {
                        //reply student photo stored in database

                        return (
                            Boom.notFound(`Aun no tenemos fotocheck para el ID ${idEmpleado}`)
                        );
                    } else {
                        let photo = data.rows[0]["SZRFOTO_FOTO"];

                        if (photo === undefined) {
                            console.log('SZRFOTO_FOTO returned undefined for ID')
                            throw Error(`SZRFOTO_FOTO returned undefined for ID ${idEmpleado}`);
                        } else {
                            //reply student photo stored in database
                            return h.response(photo).header("Content-Disposition", "inline", "Content-type", "image/png")
                            //   .header("Content-type", "image/png");
                        }
                    }
                })

                .catch(error => {
                    console.log(`idEmpleado: ${idEmpleado}`);
                    console.log("Params", request.params);
                    console.log(error);
                    return (
                        Boom.badImplementation(
                            `Error desconocido en getFoto ID ${idEmpleado}`,
                            idEmpleado
                        )
                    );
                });
            return response;
        }
    } catch (e) {
        console.log(e);
        return e
    }

};

module.exports = internals;
