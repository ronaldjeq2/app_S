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
const PhoneHandlers = require("./handlers");

//Joi is Hapi's validation library
const Joi = require("joi");

const PhoneSchema = {
  phone_id: Joi.string()
    .required()
    .example("U2FsdGVkX19w6ZK5KwrYYHfXs%2FPTwQhdBMDmb5eDZfY%3D")
    .description("Encrypted complex ID: pidm,phone_type_code,sequence"),
  phone_number: Joi.string()
    .required()
    .example("961236852")
    .description("Telephone number."),
  phone_type_code: Joi.string()
    .required()
    .default("CE")
    .description("Telelphone Type Code."),
  sequence: Joi.number()
    .required()
    .example(13)
    .description(
      "Unique sequence number for telephone numbers associated with PIDM."
    ),
  is_verified: Joi.bool()
    .required()
    .example(false)
    .default(false)
    .description("Show if phone was verified")
};

let internals = {};
/**
 * ## Set the method, path and handler
 *
 */
internals.endpoints = [
  // GET ALL USER PHONES
  {
    method: "GET",
    path: "/account/phones",
    handler: PhoneHandlers.get_all_phones,
    config: {
      auth: "token",
      description: "Get all registered user phones",
      tags: ["api", "account phone"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Array of phone objects",
              schema: Joi.array()
                .items(Joi.object(PhoneSchema))
                .label("get_all_phones")
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
  // GET PHONE BY ID
  {
    method: "GET",
    path: "/account/phones/{phone_id}",
    handler: PhoneHandlers.get_phone_by_id,
    config: {
      auth: "token",
      description: "Get all registered user phones",
      tags: ["api", "account phone"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Array of phone objects",
              schema: Joi.object(PhoneSchema).label("get_all_phones")
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
        params: Joi.object({
          phone_id: Joi.string().default(
            "U2FsdGVkX1%2Bw8mfCzDQiGqThwu4ZKOYMSiP3caxxCO0%3D"
          )
        })
      }
    }
  },
  // ADD PHONE
  {
    method: "POST",
    path: "/account/phones",
    handler: PhoneHandlers.add_phone,
    config: {
      auth: "token",
      description: "Add phone",
      tags: ["api", "account phone"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Add Phone",
              schema: Joi.object(PhoneSchema).label("add_phone")
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
        payload: Joi.object({
          phone_number: Joi.string()
            .required()
            .default("987654321")
            /** Validation moved to handler */
            .description("phone number")
            .error(new Error("El numero de telefono debe ser de celular"))
        })
      }
    }
  },
  // DELETE PHONE
  {
    method: "DELETE",
    path: "/account/phones/{phone_id}",
    handler: PhoneHandlers.delete_phone_by_id,
    config: {
      auth: "token",
      // Include this API in swagger documentation
      description: "Delete Phone",
      // notes: 'Return a classtime list',
      tags: ["api", "account phone"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Delete phone",
              schema: Joi.object(PhoneSchema).label("delete_phone")
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
          phone_id: Joi.string()
            .required()
            .default("U2FsdGVkX1%2Bw8mfCzDQiGqThwu4ZKOYMSiP3caxxCO0%3D")
            .description("secuencia del teléfono")
        }
      }
    }
  },
  // SEND VERIFICATION TOKEN
  {
    method: "POST",
    path: "/account/phones/{phone_id}/actions/send_verification_code",
    handler: PhoneHandlers.send_verification_code,
    config: {
      auth: "token",
      description: "Send a sms with a short code",
      tags: ["api", "account phone"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Send sms Message",
              schema: Joi.object({
                ...PhoneSchema,
                verification_entry_date: Joi.date()
                  .timestamp()
                  .default("2019-02-07T22:24:11.000Z"),
                verification_valid_date: Joi.date()
                  .timestamp()
                  .default("2019-02-07T22:24:11.000Z"),
                verification_code: Joi.string()
                  .default("123456(DEV_ONLY)")
                  .description("Shows only in DEV mode")
              }).label("send_verification_code")
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
        params: Joi.object({
          phone_id: PhoneSchema.phone_id
        })
      }
    }
  },
  // VALIDATE VERIFICATION CODE
  {
    method: "POST",
    path: "/account/phones/{phone_id}/actions/validate_verification_code",
    handler: PhoneHandlers.validate_verification_code,
    config: {
      auth: "token",
      description: "Validate the verification code",
      tags: ["api", "account phone"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Validate Phone",
              schema: Joi.object({
                ...PhoneSchema,
                verification_entry_date: Joi.date()
                  .timestamp()
                  .default("2019-02-07T22:24:11.000Z"),
                verification_valid_date: Joi.date()
                  .timestamp()
                  .default("2019-02-07T22:24:11.000Z")
              }).label("validate_verification_code")
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
          phone_id: PhoneSchema.phone_id
        },
        payload: Joi.object({
          verification_code: Joi.string()
            .required()
            .length(6)
            .default("456789")
            .description("Verification code")
        })
      }
    }
  }
];

module.exports = internals;
