/**
 * # student/endpoints.js
 *
 * To get student information
 *
 */
"use strict";
/**
 * ## Imports
 *
 */
//Handle the endpoints
const CourseHandlers = require("./handlers");

//Joi is Hapi's validation library
const Joi = require("joi");

let internals = {};
/**
 * ## Set the method, path and handler
 *
 */
internals.endpoints = [
  //course
  {
    method: "POST",
    path: "/course",
    handler: CourseHandlers.getListOfCourses,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get list of courses",
      // notes: 'Return a classtime list',
      tags: ["api", "course"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "classtimes object",
              schema: Joi.array()
                .items(
                  Joi.object({
                    idCarrera: Joi.string()
                      .required()
                      .length(9)
                      .example("000916949")
                      .description(
                        "Carrera, Periodo, Programa. Concatenado (-). Sin acentos."
                      ),
                    idAlumno: Joi.string()
                      .required()
                      .length(9)
                      .example("000916949")
                      .description("Id del alumno. numerico"),
                    pidm: Joi.number()
                      .required()
                      .example(916949)
                      .description("Id del alumno.Alfanumerico max. 9 digitos"),
                    programa: Joi.string()
                      .required()
                      .max(200)
                      .example("MEC. DE MANTENIMIENTO")
                      .description(
                        "programa al que pertenece el curso devuelto"
                      ),
                    carrera: Joi.string()
                      .required()
                      .max(200)
                      .example("Mec. de Mantenimiento (DUAL)")
                      .description(
                        "carrera a la que pertence el curso devuelto"
                      ),
                    periodo: Joi.string()
                      .required()
                      .length(6)
                      .example("201520")
                      .description(
                        "periodo al que pertenece el curso devuelto"
                      ),
                    nrc: Joi.string()
                      .required()
                      .length(5)
                      .example("21670")
                      .description("numero de referencia del curso"),
                    titulo: Joi.string()
                      .required()
                      .max(200)
                      .example("MATEMATICA")
                      .description("titulo del curso"),
                    calificacionFinal: Joi.number()
                      .required()
                      .precision(2)
                      .example("12.3")
                      .description("Calificacion final del curso"),
                    aprobado: Joi.boolean()
                      .required()
                      .allow("")
                      .example(true)
                      .description("verdadero si la nota es aprobatoria")
                  })
                )
                .label("getListOfCourses_success")
            },
            "401": {
              description: "Authentication failed",
              schema: Joi.object({
                statusCode: 401,
                error: "Unauthorized",
                message:
                  "Invalid signature received for JSON Web Token validation",
                attributes: {
                  error:
                    "Invalid signature received for JSON Web Token validation"
                }
              })
            }
          }
        }
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown(),

        payload: {
          inProgressFlag: Joi.boolean()
            .default(true)
            .required()
        }
      }
    }
  },
  {
    method: "GET",
    path: "/course/score/definitions",
    handler: CourseHandlers.getDefinitions,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get list of courses",
      // notes: 'Return a classtime list',
      tags: ["api", "course"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "classtimes object",
              schema: Joi.object({
                RE: Joi.string()
                  .required()
                  .example("Retiro")
                  .description("estado"),
                WN: Joi.string()
                  .required()
                  .example("Abandono de periodo")
                  .description("estado"),
                WS: Joi.string()
                  .required()
                  .example("Retiro")
                  .description("Reserva de vancante"),
                DE: Joi.string()
                  .required()
                  .example("Retiro")
                  .description("Desaprobado"),
                WA: Joi.string()
                  .required()
                  .example("Retiro autorizado")
                  .description("estado")
              }).label("getDefinitions_success")
            },
            "401": {
              description: "Authentication failed",
              schema: Joi.object({
                statusCode: 401,
                error: "Unauthorized",
                message:
                  "Invalid signature received for JSON Web Token validation",
                attributes: {
                  error:
                    "Invalid signature received for JSON Web Token validation"
                }
              })
            }
          }
        }
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown()
      }
    }
  },
  {
    method: "GET",
    path: "/course/{periodo}/{nrc}",
    handler: CourseHandlers.getCourseDetail,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get a detail of course",
      // notes: 'Return a classtime list',
      tags: ["api", "course"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "classtimes object",
              schema: Joi.array()
                .items(
                  Joi.object({
                    titulo: Joi.string()
                      .required()
                      .max(100)
                      .example("100")
                      .description("Id del alumno. numerico"),
                    peso: Joi.number()
                      .required()
                      .example(916949)
                      .description("Peso del componente"),
                    debePasar: Joi.boolean()
                      .required()
                      .example(true)
                      .description(
                        "Indica si es obligatorio obtener nota aprobatoria en el componente para aprobar el curso"
                      ),
                    calificacion: Joi.string()
                      .required()
                      .max(6)
                      .example("16,1")
                      .description("La nota del componente"),
                    instructorNombre: Joi.string()
                      .required()
                      .length(6)
                      .example("201520")
                      .description("Nombre del instructor de")
                  })
                )
                .label("getCourseDetail_success")
            },
            "401": {
              description: "Authentication failed",
              schema: Joi.object({
                statusCode: 401,
                error: "Unauthorized",
                message:
                  "Invalid signature received for JSON Web Token validation",
                attributes: {
                  error:
                    "Invalid signature received for JSON Web Token validation"
                }
              })
            }
          }
        }
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown(),

        params: {
          periodo: Joi.string()
            .required()
            .length(6)
            .default("201810")
            .description("periodo al que pertenece el curso devuelto"),
          nrc: Joi.string()
            .required()
            .max(5)
            .default("10048")
            .description("numero de referencia del curso")
        }
      }
    }
  },

  {
    method: "GET",
    path: "/course/{periodo}/schedule",
    handler: CourseHandlers.getScheduleByTerm,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get a detail of course",
      // notes: 'Return a classtime list',
      tags: ["api", "course"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "returns Schedule by term",
              schema: Joi.object({
                NRC: Joi.object({
                  codTerm: Joi.string()
                    .required()
                    .length(6)
                    .example("201520")
                    .description("periodo al que pertenece el curso devuelto"),
                  nrc: Joi.string()
                    .required()
                    .length(5)
                    .example("21670")
                    .description("número de referencia del curso"),
                  startDate: Joi.string()
                    .required()
                    .example("2018-02-12T05:00:00.000Z")
                    .description("Fecha de incio del curso"),
                  finishDate: Joi.string()
                    .required()
                    .example("2018-07-07T05:00:00.000Z")
                    .description("Fecha fin del curso "),
                  schedule: Joi.array().items(
                    Joi.object({
                      key: Joi.string().description(
                        "random unique id, necessary for react render purposes"
                      ),
                      weekDayList: Joi.array()
                        .items(Joi.string())
                        .required()
                        .example(["L", "M", "I"])
                        .description(
                          "Lista de caracteres que indican los dias de la semana (si es miércoles es I)"
                        ),
                      classTime: Joi.string()
                        .required()
                        .example("9:45 AM - 12:39 PM'")
                        .description("Horario del curso"),
                      location: Joi.string()
                        .required()
                        .example("UFP ADM. IND. CENTRO PYMES     203'")
                        .description("Lugar donde se dicta la clase"),
                      instructor: Joi.string()
                        .required()
                        .example("CONHY ISLA")
                        .description("Instructor del curso")
                    })
                  )
                })
              }).label("getScheduleByTerm_success")
            },
            "401": {
              description: "Authentication failed",
              schema: Joi.object({
                statusCode: 401,
                error: "Unauthorized",
                message:
                  "Invalid signature received for JSON Web Token validation",
                attributes: {
                  error:
                    "Invalid signature received for JSON Web Token validation"
                }
              })
            }
          }
        }
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown(),

        params: {
          periodo: Joi.string()
            .required()
            .length(6)
            .default("201810")
            .description("periodo al que pertenece el curso devuelto")
        }
      }
    }
  },

  {
    method: "GET",
    path: "/course/{periodo}/{nrc}/assistance",
    handler: CourseHandlers.getAssistanceDetail,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get a detail of course",
      // notes: 'Return a classtime list',
      tags: ["api", "course"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "returns Schedule by term",
              schema: Joi.object({
                period: Joi.string()
                  .required()
                  .length(6)
                  .default("201810")
                  .description("periodo al que pertenece el curso devuelto"),
                nrc: Joi.string()
                  .required()
                  .max(5)
                  .default("25669")
                  .description("numero de referencia del curso"),
                totalClass: Joi.number()
                  .required()
                  .example(44)
                  .description("total de días que tiene la clase"),
                classAssitance: Joi.number()
                  .required()
                  .example(18)
                  .description(
                    "cantidad de dás en las que se tomaron asistencia"
                  ),
                notRegistered: Joi.number()
                  .required()
                  .example(2)
                  .description("cantidad de asistencias que no se registraron"),
                pending: Joi.number()
                  .required()
                  .example(2)
                  .description(
                    "cantidad de días que faltan para que acabe el ciclo"
                  ),
                assitance: Joi.number()
                  .required()
                  .example(16)
                  .description("cantidad de días que asistio"),
                noAttendance: Joi.number()
                  .required()
                  .example(2)
                  .description("cantidad de días que no asistió a clases"),
                lastAssitance: Joi.string()
                  .required()
                  .default("25669")
                  .description("último día que asistió"),
                lastClass: Joi.string()
                  .required()
                  .default("25669")
                  .description("última clase"),
                assitanceList: Joi.object({
                  Date: Joi.object({
                    assitanceDate: Joi.string()
                      .description("fecha en formato DD-MM-YYYY")
                      .example("21-02-2018"),
                    dayName: Joi.string()
                      .required()
                      .example("Miércoles")
                      .description("Día de la semana"),
                    dayShort: Joi.string()
                      .required()
                      .example("X")
                      .description("Indice del día")
                  })
                })
              }).label("getScheduleByTerm_success")
            },
            "401": {
              description: "Authentication failed",
              schema: Joi.object({
                statusCode: 401,
                error: "Unauthorized",
                message:
                  "Invalid signature received for JSON Web Token validation",
                attributes: {
                  error:
                    "Invalid signature received for JSON Web Token validation"
                }
              })
            }
          }
        }
      },
      validate: {
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown(),

        params: {
          periodo: Joi.string()
            .required()
            .length(6)
            .default("201810")
            .description("periodo al que pertenece el curso devuelto"),
          nrc: Joi.string()
            .required()
            .max(5)
            .default("25669")
            .description("numero de referencia del curso")
        }
      }
    }
  }
];

module.exports = internals;
