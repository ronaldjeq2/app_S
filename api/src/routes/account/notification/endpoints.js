const NotificationHandlers = require("./handlers"),
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
        method: "GET",
        path: "/account/notification/tags",
        config: {
            auth: "token",
            handler: NotificationHandlers.getNotificationTags,
            cors: {
                origin: ["*"],
                additionalHeaders: ["cache-control", "x-requested-with"]
            },
            // Include this API in swagger documentation
            description: "Send tags sync tags with one signal",
            notes: "retrieve pair keyred objetct tags",
            tags: ["api", "notification"],
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
    },
    {
        method: "GET",
        path: "/account/notification",
        config: {
            auth: "token",
            handler: NotificationHandlers.getNotifications,
            cors: {
                origin: ["*"],
                additionalHeaders: ["cache-control", "x-requested-with"]
            },
            description: "Get notification list",
            tags: ["api", "notification"],
            plugins: {
                oracledb: true,
                "hapi-swagger": {
                    payloadType: "form",
                    responses: {
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
        method: "POST",
        path: "/account/notification/token",
        config: {
            auth: "token",
            handler: NotificationHandlers.postNotificationToken,
            cors: {
                origin: ["*"],
                additionalHeaders: ["cache-control", "x-requested-with"]
            },
            // Include this API in swagger documentation
            description: "Send push token for notification",
            notes: "send onesignal token",
            tags: ["api", "notification"],
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
                payload: Joi.object({
                    token: Joi.string()
                        .required()
                        .default("asdadasd-asdasdasd-asd-asdaasda-asdas")
                        .description("p_pid > ID Usuario / Banner PID. <br /> STRING(9)")
                }).label("account_notification_token"),

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
        method: "POST",
        path: "/account/notification",
        config: {
            auth: "token",
            handler: NotificationHandlers.createNotification,
            cors: {
                origin: ["*"],
                additionalHeaders: ["cache-control", "x-requested-with"]
            },
            description: "Send a notification and stores in mongodb",
            notes: "send onesignal notification",
            tags: ["api", "notification"],
            plugins: {
                oracledb: true,
                "hapi-swagger": {
                    //   payloadType: "form",
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
                payload: Joi.object({
                    title: Joi.string()
                        .required()
                        .description("titulo de la notificacion"),
                    message: Joi.string()
                        .required()
                        .description("Mensaje de la notificacion"),
                    icon: Joi.string()
                        .valid(
                            "notas",
                            "recordatorio",
                            "evento",
                            "matricula",
                            "certificado"
                        )
                        .required(),
                    linkPath: Joi.string().valid(""),
                    linkLabel: Joi.string().valid(""),
                    users: Joi.array()
                        .items(Joi.number().integer())
                        .required()
                        .description("List of pidm to notify")
                }).label("account_notification_token"),

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
