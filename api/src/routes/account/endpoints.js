/**
 * # account/endpoints.js
 *
 * To login and get main user information
 *
 */
"use strict";
/**
 * ## Imports
 *
 */
//Handle the endpoints
const AccountHandlers = require("./handlers"),
  //Joi is Hapi's validation library
  Joi = require("joi");

let internals = {};
/**
 * ## Set the method, path, and handler
 *
 * Note the validation of the account/register parameters
 *
 */
internals.endpoints = [
  {
    method: "POST",
    path: "/account/token",
    config: {
      handler: AccountHandlers.loginUser,
      cors: {
        origin: ["*"],
        additionalHeaders: ["cache-control", "x-requested-with"]
      },
      // Include this API in swagger documentation
      description: "Get token for user authentication",
      notes: "The client prompts login will return a sessionToken",
      tags: ["api", "account"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Success",
              schema: Joi.string().label("account_token_success")
            },
            "400": {
              description: "Bad Request",
              schema: Joi.object({
                statusCode: 400,
                error: "Bad Request",
                message:
                  'child "username" fails because ["username" must be a number]',
                validation: {
                  source: "payload",
                  keys: ["username"]
                }
              })
            },
            "401": {
              description: "Authentication failed",
              schema: Joi.object({
                statusCode: 401,
                error: "Unauthorized",
                message: "Authentication failed"
              })
            }
          }
        }
      },
      validate: {
        payload: Joi.object({
          username: Joi.string()
            .max(9)
            .required()
            .default("948370")
            .description("p_pid > ID Usuario / Banner PID. <br /> STRING(9)")
            .error(errors => {
              const firstError = errors[0];
              let message = "Tu ID no tiene un formato valido";

              if (firstError.type === "string.max") {
                message = "El ID debe tener como maximo 9 caracteres";
              }
              return new Error(message, { data: "some data" });
            }),
          password: Joi.string()
            .min(6)
            .max(15)
            .required()
            .default("123456")
            .description(
              `p_pin > NIP /
              Banner Personal Identification Number. <br />
              STRING(6-15)`
            )
            .error(errors => {
              const firstError = errors[0];
              let message = "Tu contraseña no tiene un formato valido";
              if (firstError.type === "string.min") {
                message = "La contraseña debe tener minino 6 caracteres";
              } else if (firstError.type === "string.max") {
                message = `La contraseña debe tener maximo 15 caracteres`;
              }
              return new Error(message, { data: "some data" });
            })
        }).label("account_login_parameters")
      }
    }
  },
  // user info
  {
    method: "POST",
    path: "/account/info",
    handler: AccountHandlers.get_user_info,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get user information",
      tags: ["api", "account"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "user info object",
              schema: Joi.object({
                id: Joi.string()
                  .required()
                  .length(9)
                  .example("001102734")
                  .description(
                    "id del usuario en formato string  con 0 a la izquierda"
                  ),
                pidm: Joi.number()
                  .required()
                  .example(1102734)
                  .description("id del usuario en formato numérico"),
                docType: Joi.string()
                  .required()
                  .max(6)
                  .example("DNI")
                  .description(" tipo de documento del usuario"),
                numDoc: Joi.string()
                  .required()
                  .max(15)
                  .example("73090498")
                  .description(" Numero del documento"),
                firstName: Joi.string()
                  .required()
                  .max(60)
                  .example("DASDY")
                  .description(" Primer nombre de la persona"),
                middleName: Joi.string()
                  .max(60)
                  .example("KARIN")
                  .description(
                    " Segundo nombre de la persona, , puede ser null"
                  ),
                lastName: Joi.string()
                  .required()
                  .max(60)
                  .example("ARCE CARHUAMACA")
                  .description(" Apellidos de la persona"),
                lastPeriodVigent: Joi.string()
                  .required()
                  .example("201810")
                  .description("periodo vigente"),
                hasStudentCard: Joi.bool()
                  .required()
                  .example(true)
                  .description(" Boolean si tiene o no carnet de estudiante"),
                haswORKCard: Joi.bool()
                  .required()
                  .example(true)
                  .description(" Boolean si tiene o no carnet de trabajador"),
                studentCard: Joi.object({
                  career: Joi.string()
                    .required()
                    .example("Administración Industrial")
                    .description(" Carrera de la persona "),
                  program: Joi.string()
                    .required()
                    .example("ADMINISTRACIÓN INDUSTRIAL(DUAL")
                    .description(
                      " Programa que pertenece la persona, puede ser dual u otra "
                    ),
                  hasPhoto: Joi.bool()
                    .required()
                    .example(true)
                    .description(" Booleano si tiene o no fotocheck "),
                  photo: Joi.object({
                    height: Joi.number()
                      .required()
                      .example(240)
                      .description("Alto de la imagen"),
                    width: Joi.number()
                      .required()
                      .example(320)
                      .description("Alto de la imagen")
                  })
                }),
                workerDetail: Joi.object({
                  Zonal: Joi.string()
                    .example("ZONAL JUNIN-PASCO-HUANCAVELICA")
                    .description(" Zona en la que se encuentra el trabajador"),
                  Cargo: Joi.string()
                    .example("H09 INSTRUCTOR PRONABEC 02")
                    .description(" Cargo que ejerce en la institución "),
                  Fecha_Cese: Joi.string()
                    .example("12-10-2018")
                    .description(" Fecha fin del contrato ")
                }),
                careerDetail: Joi.object({
                  firstPeriod: Joi.string()
                    .example("201610")
                    .description("periodo de inicio"),
                  currentPeriod: Joi.string()
                    .example("201810")
                    .description("periodo actual"),
                  studenType: Joi.string()
                    .example("Repitente")
                    .description("tipo de estudiante"),
                  blocks: Joi.array(),
                  lessons: Joi.array()
                }),
                curriculumDetail: Joi.object({
                  level: Joi.string()
                    .example("PROFESIONAL")
                    .description("nivel "),
                  program: Joi.string()
                    .example("TEC. ING. MEC.  MANT")
                    .description("programa"),
                  school: Joi.string()
                    .example("METALMECANICA")
                    .description("escuela a la que pertenece"),
                  campus: Joi.string()
                    .example("ESCUELA SUPERIOR DE TECNOLOGIA")
                    .description("campus")
                }),
                addressList: Joi.array().items(
                  Joi.object({
                    key: Joi.string()
                      .required()
                      .example("06cb11d0-6fdd-4a1a-b8c2-ecc5e2cc44b1")
                      .description("id de la direccion encriptada"),
                    address: Joi.string()
                      .example("JR PISCOBAMBA 1573 URB PARQUE NARANJAL ")
                      .description("Dirección de la persona, , puede ser null"),
                    city: Joi.string()
                      .required()
                      .max(50)
                      .example("Los Olivos")
                      .description("Ciudad que pertenece la dirección"),
                    type: Joi.string()
                      .max(30)
                      .example("Domicilio")
                      .description("Ciudad que pertenece la dirección")
                  })
                ),
                phoneList: Joi.array().items(
                  Joi.object({
                    key: Joi.string()
                      .required()
                      .example("fd924f77-349e-458d-89d6-24506edc960b")
                      .description("id del número telefónico encriptado"),
                    number: Joi.string()
                      .max(12)
                      .example("4854931")
                      .description("Número del teléfono, puede ser null"),
                    area: Joi.string()
                      .max(6)
                      .example("01")
                      .description("Área en la que se encuentra el teléfono"),
                    type: Joi.string()
                      .example("Domicilio")
                      .description(
                        "Categoría a la que pertenece el número telefónico "
                      )
                  })
                ),
                emailList: Joi.array().items(
                  Joi.object({
                    key: Joi.string()
                      .required()
                      .example("3002c375-98b8-4f9e-989c-c77ccc426daa")
                      .description("id del email encriptado"),
                    code: Joi.string()
                      .required()
                      .example("undefined")
                      .description("Código del email, puede ser undefined"),
                    address: Joi.string()
                      .max(128)
                      .example("dasdykarin@gmail.com")
                      .description(
                        "Direccion email de la persona, puede ser null"
                      ),
                    status: Joi.string()
                      .required()
                      .example("A")
                      .description("Status del email si es activo o inactivo"),
                    preferred: Joi.bool()
                      .required()
                      .example(false)
                      .description("Si el email es el principal o no")
                  })
                ),

                birthday: Joi.date()
                  .required()
                  .example(new Date())
                  .description(" Fecha de nacimiento")
              }).label("get_user_info_success")
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
  // get code for autlogin in ssb
  {
    method: "GET",
    path: "/account/ssb",
    handler: AccountHandlers.get_ssb_login,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get code for autologin on ssb",
      // notes: 'Return a classtime list',
      tags: ["api", "account"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "autologin code"
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
  }
];

module.exports = internals;
