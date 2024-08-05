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
const EmailHandlers = require("./handlers");

//Joi is Hapi's validation library
const Joi = require("joi");

const EmailSchema = {
  email_id: Joi.string()
    .required()
    .example("U2FsdGVkX19w6ZK5KwrYYHfXs%2FPTwQhdBMDmb5eDZfY%3D")
    .description("Encrypted complex ID: pidm,email_type_code, email_address"),
  email_address: Joi.string()
    .required()
    .max(128)
    .example("fescate@senati.edu.pe")
    .description("email address."),
  email_type_code: Joi.string()
    .required()
    .default("LABO")
    .length(4)
    .description("Email type code."),
  email_type_description: Joi.string()
    .required()
    .default("LABORAL")
    .description("Email Type description."),
  is_verified: Joi.bool()
    .required()
    .example(false)
    .default(false)
    .description("Show if email was verified")
};

let internals = {};

internals.endpoints = [
  // GET ALL USER EMAILS
  {
    method: "GET",
    path: "/account/emails",
    handler: EmailHandlers.get_all_emails,
    config: {
      auth: "token",
      description: "Get all registered user emails",
      tags: ["api", "account email"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Array of email objects",
              schema: Joi.array()
                .items(Joi.object(EmailSchema))
                .label("get_all_emails")
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
  // GET EMAIL BY ID
  {
    method: "GET",
    path: "/account/emails/{email_id}",
    handler: EmailHandlers.get_email_by_id,
    config: {
      auth: "token",
      description: "Get all registered user emails",
      tags: ["api", "account email"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Array of email objects",
              schema: Joi.object(EmailSchema).label("get_all_emails")
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
          email_id: Joi.string().default(
            "U2FsdGVkX1%2Bw8mfCzDQiGqThwu4ZKOYMSiP3caxxCO0%3D"
          )
        })
      }
    }
  },
  // GET TYPE EMAIL
  {
    method: "GET",
    path: "/account/emails/types",
    handler: EmailHandlers.get_type_email,
    config: {
      auth: "token",
      description: "Get all registered user emails",
      tags: ["api", "account email"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Array of email objects",
              schema: Joi.array()
                .items(
                  Joi.object({
                    email_type_code: EmailSchema.email_type_code,
                    email_type_description: EmailSchema.email_type_description
                  })
                )
                .label("get_types_emails")
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
  // ADD EMAIL
  {
    method: "POST",
    path: "/account/emails",
    handler: EmailHandlers.add_email,
    config: {
      auth: "token",
      description: "Add email",
      tags: ["api", "account email"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Add Email",
              schema: Joi.object(EmailSchema).label("add_email")
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
          email_address: Joi.string()
            .trim()
            .required()
            .default("fescate@senati.edu.pe")
            .description("email address"),
          email_type_code: Joi.string()
            .required()
            .default("SEN")
            .description("email type code")
        })
      }
    }
  },
  // DELETE EMAIL
  {
    method: "DELETE",
    path: "/account/emails/{email_id}",
    handler: EmailHandlers.delete_email_by_id,
    config: {
      auth: "token",
      description: "Delete Email",
      tags: ["api", "account email"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Delete email",
              schema: Joi.object(EmailSchema).label("delete_email")
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
          email_id: Joi.string()
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
    path: "/account/emails/{email_id}/actions/send_verification_code",
    handler: EmailHandlers.send_verification_code,
    config: {
      auth: "token",
      description: "Send a email with a code",
      tags: ["api", "account email"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Send email Message",
              schema: Joi.object({
                ...EmailSchema,
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
          email_id: EmailSchema.email_id
        })
      }
    }
  },
  // VALIDATE VERIFICATION CODE
  {
    method: "POST",
    path: "/account/emails/{email_id}/actions/validate_verification_code",
    handler: EmailHandlers.validate_verification_code,
    config: {
      auth: "token",
      description: "Validate the verification code",
      tags: ["api", "account email"],
      plugins: {
        oracledb: true,
        "hapi-swagger": {
          payloadType: "form",
          responses: {
            "200": {
              description: "Validate Email",
              schema: Joi.object({
                ...EmailSchema,
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
          email_id: EmailSchema.email_id
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
