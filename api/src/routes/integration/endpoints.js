"use strict";
//Handle the endpoints
const IntegrationHandlers = require("./handlers"),
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
    path: "/integration/send_mail_with_template",
    config: {
      handler: IntegrationHandlers.sendMailWithTemplate,
      cors: {
        origin: "ignore",
        headers: [
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Accept",
          "Content-Type",
          "If-None-Match",
          "Accept-language"
        ],
        additionalHeaders: ["cache-control", "x-requested-with"]
      },
      // Include this API in swagger documentation
      description: "Send Mail",
      tags: ["api", "integration"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          //   payloadType: "json"
        }
      },
      validate: {
        payload: Joi.object({
          email_address: Joi.string()
            .email()
            .required()
            .default("algo@algo.com")
            .description("correo destino"),
          subject: Joi.string().required(),
          template_id: Joi.string().required(),
          template_data: Joi.object().required(),
          validation_key: Joi.string().required()
        })

        // headers: Joi.object({
        //   authorization: Joi.string()
        //     .required()
        //     .default(`Bearer ${process.env.TEST_TOKEN}`)
        //     .description("Valid token generated on account/token")
        // }).unknown()
      }
    }
  }
];

module.exports = internals;
