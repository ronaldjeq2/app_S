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
const PeriodsHanlders = require("./handlers");

//Joi is Hapi's validation library
const Joi = require("joi");

let internals = {};
/**
 * ## Set the method, path and handler
 *
 */
internals.endpoints = [
  //payments
  {
    method: "GET",
    path: "/payments/term",
    handler: PeriodsHanlders.getListPeriods,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get list of payments",
      // notes: 'Return a classtime list',
      tags: ["api", "payments"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "payments object",
              schema: Joi.array()
                .items(
                  Joi.object({
                    pidm: Joi.number()
                      .required()
                      .example(948370)
                      .description("Id del alumno.Alfanumerico max. 9 digitos"),
                    periodo: Joi.string()
                      .required()
                      .length(6)
                      .example("201504")
                      .description(
                        "periodo al que pertenece el curso devuelto"
                      ),
                    periodoDesc: Joi.string()
                      .required()
                      .example("Pre Senati 2015")
                      .description("Descripción del periodo"),
                    indMatriculado: Joi.string()
                      .required()
                      .length(1)
                      .example("Y")
                      .description("Y or N  indicador de periodo")
                  })
                )
                .label("getListPeriods_success")
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
    path: "/payments/term/{period}/detail",
    handler: PeriodsHanlders.getPeriodDetail,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get list of payments",
      // notes: 'Return a classtime list',
      tags: ["api", "payments"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "payments object",
              schema: Joi.object({
                mountCanceled: Joi.string()
                  .required()
                  .example("565.00")
                  .description("Monto cancelado"),
                mountTotal: Joi.string()
                  .required()
                  .example("2825.00")
                  .description("Monto total del periodo"),
                currentPayment: Joi.object({
                  dueDate: Joi.string()
                    .required()
                    .example("07/06/2018")
                    .description(
                      "fecha de vencimiento en string con formato DD/MM/YYYY"
                    ),
                  mount: Joi.string()
                    .required()
                    .example("2260.00")
                    .description(
                      "Monto total de la deuda o futura deuda por periodo "
                    ),
                  title: Joi.string()
                    .required()
                    .example("Monto total de las 8 últimas cuotas vencidas")
                    .description("Descripción de la deuda o futura deuda")
                }),

                termDetail: Joi.array().items(
                  Joi.object({
                    keyPayment: Joi.string().description(
                      "random unique id, necessary for react render purposes"
                    ),
                    tittle: Joi.string()
                      .required()
                      .example("Matricula")
                      .description("Descripci{on de la cuota"),

                    mount: Joi.string()
                      .required()
                      .example("455.00")
                      .description("Monto de la cuota"),
                    balance: Joi.string()
                      .required()
                      .example("0.00")
                      .description("Total a deber"),
                    dueDate: Joi.string()
                      .required()
                      .example("07/06/2018")
                      .description(
                        "fecha de vencimiento en string con formato DD/MM/YYYY"
                      ),
                    state: Joi.string()
                      .required()
                      .example("Cancelada")
                      .description(
                        "Estado en que se encuentra la cuota Cancelada-Pendiente de pago"
                      ),
                    debt: Joi.boolean()
                      .required()
                      .allow("")
                      .example(true)
                      .description("Indicador si venció la cuota")
                  })
                )
              }).label("getListPeriods_success")
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
          period: Joi.string()
            .required()
            .max(6)
            .default("201810")
            .description("periodo al que pertenece el curso devuelto")
        }
      }
    }
  }
];

module.exports = internals;
