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
const PlacesHanlders = require("./handlers");

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
        path: "/places/list",
        handler: PlacesHanlders.getPlaces,
        config: {
            // Include this API in swagger documentation
            description: "Get list of places",
            // notes: 'Return a classtime list',
            tags: ["api", "places"],
            plugins: {
                oracledb: true,
                "hapi-swagger": {
                    payloadType: "form",
                    responses: {
                        "200": {
                            description: "places object",
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
            }
        }
    },


];

module.exports = internals;
