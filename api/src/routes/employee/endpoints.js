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
  {
    method: "GET",
    path: "/employee/{userId}/card/photo",
    handler: StudentHandlers.getEmployeePhoto,
    config: {
      auth: "token",
      description: "Get photo of employee",
      tags: ["api", "employee"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payload: {
            payloadType: "form"
          },
          responses: {
            "200": {
              description: "employee employee"
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
            .description("p_pid > ID employee / Banner PID. <br /> STRING(9)")
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
