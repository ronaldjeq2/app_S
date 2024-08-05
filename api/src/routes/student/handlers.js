/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
"use strict";
const Boom = require("boom");
const oracledb = require("oracledb");

const cm_date = require("../../common/date.js");

const st_classtime = require("../../database/banner_api/st_classtime");
const st_classmate = require("../../database/banner_api/st_classmate");

var _ = require("lodash");

let internals = {};
/**
 * ## restrictedArea - you can only reach here if you've passed
 * authentication
 *
 * note: the user name is available from the credentials!
 */
internals.classtimes = function (request, h) {
    let credentials = request.auth.credentials;
    const startDate = request.payload.start_date.split("-");
    const newDate = `${startDate[2]}/${startDate[1]}/${startDate[0]}`;

    try {
        const query = st_classtime.f_query_all(credentials.pidm, newDate);


        return request.app.db
            .execute(...query)
            .then(data => {
                let row;
                let events = {};
                let event;
                let cursor_date;
                let target_date;
                let end_date;

                let cursor_day;
                let weekDays = [];

                for (var i = data.rows.length - 1; i >= 0; i--) {
                    row = data.rows[i];

                    end_date = row.SSRMEET_END_DATE;
                    cursor_day = row.SSRMEET_START_DATE.getDay();

                    weekDays = [
                        row.SSRMEET_SUN_DAY ? 0 : null,
                        row.SSRMEET_MON_DAY ? 1 : null,
                        row.SSRMEET_TUE_DAY ? 2 : null,
                        row.SSRMEET_WED_DAY ? 3 : null,
                        row.SSRMEET_THU_DAY ? 4 : null,
                        row.SSRMEET_FRI_DAY ? 5 : null,
                        row.SSRMEET_SAT_DAY ? 6 : null
                    ];

                    weekDays = weekDays.filter(weekday => weekday !== null); //delete null values from array
                    event = {
                        date_event: "",
                        begin_time: cm_date.h_format(row.SSRMEET_BEGIN_TIME),
                        end_time: cm_date.h_format(row.SSRMEET_END_TIME),
                        course_code: row.SSRMEET_CRN,
                        course_title: row.SSBSECT_CRSE_TITLE,
                        term_code: row.SSRMEET_TERM_CODE,
                        bldg_code: row.SSRMEET_BLDG_CODE,
                        bldg_desc: row.STVBLDG_DESC.trim(),
                        room_code: row.SSRMEET_ROOM_CODE,
                        inst_name:
                            row.INST_LAST_NAME +
                            ", " +
                            row.INST_FIRST_NAME +
                            (row.INST_MID_NAME ? " " + row.INST_MID_NAME : ""),
                        inst_pidm: row.INST_PIDM
                    };

                    // iterate week days to find each class date between them
                    weekDays.forEach(function (target_day, index) {
                        // reset cursor date foreach week
                        cursor_date = row.SSRMEET_START_DATE;

                        let daysToAdd =
                            target_day - cursor_day >= 0
                                ? target_day - cursor_day
                                : target_day - cursor_day + 7;

                        while (cursor_date.addDays(daysToAdd) <= end_date) {
                            cursor_date = cursor_date.addDays(daysToAdd);
                            daysToAdd = 7;

                            // transform cursor_date to YYYY-MM-DD format
                            event.date_event = cursor_date.toISOString().split("T")[0];

                            events[event.date_event] = events[event.date_event] || [];

                            events[event.date_event].push(_.assign({}, event));
                        } //while
                    }); //weekDays.forEach
                } //for row
                return (events);
            })
            .catch(error => {
                console.log(error);
                return (error);
            });
    }
    catch (e) {
        console.log(e);
        return e
    }
};

/**
 * ## restrictedArea - you can only reach here if you've passed
 * authentication
 *
 * note: the user name is available from the credentials!
 */
internals.classmateBirthdays = function (request, h) {
    let credentials = request.auth.credentials;
    try {
        const query = st_classmate.get_upcoming_birthdays(
            credentials.pidm,
            request.payload.ref_date
        );

        return request.app.db
            .execute(...query)
            .then(data => {
                if (!data || !data.rows) {
                    return reply(Boom.badImplementation(`\' invalid \', data: '${data}'`));
                }
                let birthday = [];
                data.rows.map(row => {
                    birthday.push({
                        studentId: row["STUDENT_ID"],
                        lastname: row["LAST_NAME"],
                        firstname: row["FIRST_NAME"],
                        middlename: row["MIDDLE_NAME"],
                        birthdate: row["BIRTH_DATE"],
                        birthdate_string: row["BIRTH_DATE_STRING"]
                    });
                });
                return (birthday);
            })
            .catch(error => {
                console.log(error);
                return (error);
            });
    }
    catch (e) {
        console.log(e);
        return e
    }
};

/**
 *
 * note: the user name is available from the credentials!
 */

internals.getStudentCardInfo = function (request, h) {
    const credentials = request.auth.credentials;
    try {
        const idAlumno = credentials.pid;
        const student = {
            idAlumno: null,
            nombre: null,
            apellidos: null,
            carrera: null,
            programa: null,
            dni: null,
            hasPhoto: false
        };

        return request.app.db
            .execute(
                ...[
                    `
          select * from table(SENATI.gwzwapp.f_datos_fotocheck_tbl( :idAlumno ))
        `,
                    {
                        idAlumno: {
                            dir: oracledb.BIND_IN,
                            type: oracledb.STRING,
                            maxSize: 9,
                            val: idAlumno
                        }
                    },
                    { outFormat: oracledb.OBJECT }
                ]
            )

            .then(data => {
                if (data.rows.length === 0 || data.rows[0] === undefined) {
                    return ({});
                } else {
                    let row = data.rows[0];

                    student.idAlumno = row["ID"];
                    student.nombre = row["NOMBRE"];
                    student.apellidos = row["APELLIDOS"];
                    student.carrera = row["CARRERA"];
                    student.programa = row["PROGRAMA"];
                    student.numDoc = row["DOC_IDENT"].slice(0, -1);
                    student.docType = row["DOC_IDENT"].slice(-1);

                    // Verify if exist fotocheck
                    return request.app.db.execute(
                        ...[
                            `
                  SELECT
                    SZRFOTO_PIDM,
                    SZRFOTO_ALTO as PHOTO_HEIGHT,
                    SZRFOTO_ANCHO as PHOTO_WIDTH
                  FROM
                    SENATI.SZRFOTO
                  WHERE
                    SZRFOTO_PIDM = :pidm
                    AND SZRFOTO_TIPO = 'C'
                    AND ROWNUM = 1
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
                }
            })

            .then(data => {
                if (data.rows.length > 0 && data.rows[0].SZRFOTO_PIDM !== undefined) {
                    student.hasPhoto = true;
                    student.photoSize = {
                        height: data.rows[0].PHOTO_HEIGHT,
                        width: data.rows[0].PHOTO_WIDTH
                    };
                }
                return (student);
            })

            .catch(error => {
                console.log(`idAlumno: ${credentials.pid}`);
                console.log(error);
                return (
                    Boom.badImplementation(
                        `Error desconocido en getFotocheckInfo on ID ${credentials.pid}`
                    )
                );
            });
    }
    catch (e) {
        console.log(e);
        return e
    }
};

/*

*/

internals.getStudentPhoto = function (request, h) {
    const credentials = request.auth.credentials;
    const idAlumno = credentials.pidm;
    try {
        if (request.params.userId !== credentials.pid) {
            return (Boom.unauthorized("El userId no corresponde con la llave de acceso"));
        } else {
            return request.app.db
                .execute(
                    ...[
                        `
          SELECT
              SZRFOTO_FOTO
            FROM
              SENATI.SZRFOTO
            WHERE
              SZRFOTO_PIDM = :idAlumno
              AND SZRFOTO_TIPO = 'C'
              AND ROWNUM = 1
        `,
                        {
                            idAlumno: {
                                dir: oracledb.BIND_IN,
                                type: oracledb.NUMBER,
                                val: idAlumno
                            }
                        },
                        { outFormat: oracledb.OBJECT }
                    ]
                )

                .then(data => {

                    if (data.rows.length === 0 || data.rows[0] === undefined) {
                        //reply student photo stored in database
                        return (
                            Boom.notFound(`Aun no tenemos fotocheck para el ID ${idAlumno}`)
                        );
                    } else {
                        let photo = data.rows[0]["SZRFOTO_FOTO"];

                        if (photo === undefined) {
                            throw Error(`SZRFOTO_FOTO returned undefined for ID ${idAlumno}`);
                        } else {
                            console.log('e')
                            //reply student photo stored in database
                            return h.response(photo)
                                .header("Content-Disposition", "inline", "Content-type", "image/png")
                            //.header("Content-type", "image/png");
                        }
                    }
                })

                .catch(error => {
                    console.log(`idAlumno: ${idAlumno}`);
                    console.log("Params", request.params);
                    console.log(error);
                    return (
                        Boom.badImplementation(
                            `Error desconocido en getFoto ID ${idAlumno}`,
                            idAlumno
                        )
                    );
                });
        }

    }
    catch (e) {
        console.log(e)
        return e
    }
};

module.exports = internals;
