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
const StudentHandlers = require("./handlers");

//Joi is Hapi's validation library
const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);

let internals = {};
/**
 * ## Set the method, path and handler
 *
 */
internals.endpoints = [
  //classtimes
  {
    method: "POST",
    path: "/student/classtimes",
    handler: StudentHandlers.classtimes,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get the class schedule",
      // notes: 'Return a classtime list',
      tags: ["api", "student"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "classtimes object",
              schema: Joi.object({
                "YYYY-MM-DD": Joi.array().items(
                  Joi.object({
                    date_event: Joi.string()
                      .length(10)
                      .required()
                      .example("2017-11-18")
                      .description("fecha "),
                    begin_time: Joi.string()
                      .example("7:30 PM")
                      .description("Hora de inicio de clase "),
                    end_time: Joi.string()
                      .example("8:28 PM")
                      .description("Hora de fin de clase "),
                    course_code: Joi.string()
                      .max(5)
                      .required()
                      .example("2235")
                      .description("Código del curso"),
                    course_title: Joi.string()
                      .length(30)
                      .example("RAZONAMIENTO LÓGICO MATEMÁTICO")
                      .description("Título del curso"),
                    term_code: Joi.string()
                      .required()
                      .example("201704")
                      .description("Código del curso"),
                    bldg_code: Joi.string()
                      .example("65G1")
                      .description("Código del Pabellón"),
                    bldg_desc: Joi.string()
                      .example("107")
                      .description("Número del aula"),
                    room_code: Joi.string()
                      .required()
                      .example("PABELLON G")
                      .description("Nombre del Pabellón"),
                    inst_name: Joi.string()
                      .required()
                      .example("VALENCIA MOROCHO, CARLOS ARTURO")
                      .description("Nombre y apellidos del docente"),
                    inst_pidm: Joi.number()
                      .required()
                      .example(489836)
                      .description("Código del profesor")
                  })
                )
              }).label("account_token_success")
            },
            "400": {
              description: "Bad Request",
              schema: Joi.object({
                statusCode: 400,
                error: "Bad Request",
                message:
                  'child "start_date" fails because ["start_date" must be a string with one of the following formats [YYYY-MM-DD]]',
                validation: {
                  source: "payload",
                  keys: ["start_date"]
                }
              })
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
        payload: Joi.object({
          start_date: Joi.date()
            .format("YYYY-MM-DD")
            .raw()
            .required()
            .default(new Date().toISOString().split("T")[0])
            .description("date for classtime search")
        }).label("start_date"),

        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown()
      }
    }
  },
  //classmate birthdays
  {
    method: "POST",
    path: "/student/classmate/birthdays",
    handler: StudentHandlers.classmateBirthdays,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description:
        "Get classmates from class schedule by a reference date and then get upconming birthdays from the next 45 days",
      // notes: 'Return a classtime list',
      tags: ["api", "student"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "classmate birthday object",
              schema: Joi.array()
                .items(
                  Joi.object({
                    studentId: Joi.number()
                      .required()
                      .example(1126486)
                      .description("Id del estudiante que cumple años"),
                    lastname: Joi.string()
                      .required()
                      .max(60)
                      .example("MORILLO MOZOMBITE")
                      .description("Apellidos del estudiante que cumple años"),
                    firstname: Joi.string()
                      .max(60)
                      .example("MILAGROS")
                      .description(
                        "Primer nombre del estudiante que cumple años, puede ser null"
                      ),
                    middlename: Joi.string()
                      .max(60)
                      .example("ALESSANDRA")
                      .description(
                        "Segundo  nombre del estudiante que cumple años, puede ser null"
                      ),
                    birthdate: Joi.date()
                      .required()
                      .example(new Date())
                      .description("Cumpleaños de la persona en formato date"),
                    birthdate_string: Joi.string()
                      .required()
                      .example("22/12/2018")
                      .description(
                        "Cumpleaños de la persona en formato string DD/MM/YYYY"
                      )
                  })
                )
                .label("classmate_birthdays_success")
            },
            "400": {
              description: "Bad Request",
              schema: Joi.object({
                statusCode: 400,
                error: "Bad Request",
                message:
                  'child "ref_date" fails because ["ref_date" must be a string with one of the following formats [YYYY-MM-DD]]',
                validation: {
                  source: "payload",
                  keys: ["start_date"]
                }
              }).label("classmate_birthdays_badRequest")
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
              }).label("classmate_birthdays_authenticationFailed")
            }
          }
        }
      },
      validate: {
        payload: Joi.object({
          ref_date: Joi.date()
            .format("YYYY-MM-DD")
            .required()
            .default(new Date().toISOString().split("T")[0])
            .description("reference date for classmates birthday search")
        }).label("classmate_birthday_reference_date"),

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
    path: "/student/card",
    handler: StudentHandlers.getStudentCardInfo,
    config: {
      auth: "token",

      description: "Get student info",

      tags: ["api", "student"],

      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "fotocheck object",
              schema: Joi.object({
                idAlumno: Joi.string()
                  .required()
                  .length(9)
                  .example("000916949")
                  .description("Id del alumno. numerico"),
                nombre: Joi.string()
                  .required()
                  .max(200)
                  .example("Juan Carlos")
                  .description("Primer y segundo nombre del alumno"),
                apellidos: Joi.string()
                  .required()
                  .max(200)
                  .example("Frrangancio Arakaki")
                  .description("Apellidos paterno y materno del alumno"),
                carrera: Joi.string()
                  .required()
                  .max(200)
                  .example("Mec. de Mantenimiento (DUAL)")
                  .description("carrera a la que pertence el alumno"),
                url: Joi.string()
                  .required()
                  .max(200)
                  .example("www.google.com.pe")
                  .description("url de la foto del alumno")
              }).label("getFotocheck_success")
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
    path: "/student/{userId}/card/photo",
    handler: StudentHandlers.getStudentPhoto,
    config: {
      auth: "token",
      description: "Get photo of student",
      tags: ["api", "student"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payload: {
            payloadType: "form"
          },
          responses: {
            "200": {
              description: "student student"
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
        params: Joi.object({
          userId: Joi.string()
            .length(9)
            .required()
            .default("948370")
            .description("p_pid > ID Usuario / Banner PID. <br /> STRING(9)")
        }).label("student_photo_userId"),

        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown()
      }
    }
  }
];

module.exports = internals;
