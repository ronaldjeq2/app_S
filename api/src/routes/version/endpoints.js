/**
 * # Get question list
 *
 */
"use strict";

/**
 * ## Imports
 *
 */
const RestrictedHandlers = require("./handlers"),
  Joi = require("joi");

let internals = {};
/**
 * ## endpoints
 *
 * note the config which means authentication is required to access
 * this end point
 *
 */
internals.endpoints = [
  {
    method: "GET",
    path: "/version/app/{version}",
    handler: RestrictedHandlers.getVersionDetail,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Get question list",
      notes: "deteail version App",
      tags: ["api", "version"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Valid token",
              schema: Joi.object({
                version: Joi.object({
                  lanzamiento: Joi.string()
                    .example("Lanzamiento 31-Octubre-2018")
                    .description("Fecha de lanzamiento de la app"),
                  detail: Joi.object({})
                })
              }).label("survey_question_list")
            },
            "400": {
              description: "Bad Request",
              schema: Joi.object({
                statusCode: 400,
                error: "Bad Request",
                message: "Bad HTTP authentication header format"
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
        headers: Joi.object({
          authorization: Joi.string()
            .required()
            .default(`Bearer ${process.env.TEST_TOKEN}`)
            .description("Valid token generated on account/token")
        }).unknown(),

        params: {
          version: Joi.string()
            .required()
            .max(6)
            .default("1.6")
            .description("versión de la app")
        }
      }
    }
  },
  {
    method: "GET",
    path: "/version/app/listVersion",
    config: {
      handler: RestrictedHandlers.checkVersion,
      // Include this API in swagger documentation
      description: "Get question list",
      notes: "deteail version App",
      cors: {
        origin: ["*"],
        additionalHeaders: ["cache-control", "x-requested-with"]
      },
      tags: ["api", "version"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Valid token",
              schema: Joi.object({
                version: Joi.object({
                  forceUpdate: Joi.bool()
                    .example(false)
                    .description("Forzar actualización"),
                  sugestUpdate: Joi.bool()
                    .example(false)
                    .description("Sugerir actualización")
                })
              }).label("survey_question_list")
            },
            "400": {
              description: "Bad Request",
              schema: Joi.object({
                statusCode: 400,
                error: "Bad Request",
                message: "Bad HTTP authentication header format"
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
      }
    }
  }
];

module.exports = internals;
