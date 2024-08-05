/**
 * # Get question list
 * 
 */
'use strict';

/**
* ## Imports
*
*/
const RestrictedHandlers = require('./handlers'),
      Joi = require('joi');

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
    method: 'GET',
    path: '/survey/question',
    handler: RestrictedHandlers.questionList,
    config: {
      auth: 'token',
      // Include this API in swagger documentation
      description: 'Get question list',
      notes: 'Survey question list',
      tags: ['api', 'survey'],
      plugins: {
        oracledb: true,
        'hapi-swagger': {
          payloadType: 'form',
          responses: {
            '200': {
              'description': 'Valid token',
              'schema': 
                  Joi.array().items(
                    Joi.object({
                      "question_id"    : Joi.number(),
                      "question_text"  : Joi.string(),
                      "answer_text"  : Joi.string(),
                    })
                  ).label('survey_question_list')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                "statusCode": 400,
                "error": "Bad Request",
                "message": "Bad HTTP authentication header format"
              })
            },
            '401': {
              'description': 'Authentication failed',
              'schema': Joi.object({
                        "statusCode": 401,
                        "error": "Unauthorized",
                        "message": "Invalid signature received for JSON Web Token validation",
                        "attributes": {
                          "error": "Invalid signature received for JSON Web Token validation"
                        }
                      })
            }
          }
        }
      },
      validate: {
        headers: Joi.object({
         'authorization': Joi.string()
                              .required()
                              .default(`Bearer ${process.env.TEST_TOKEN}`)
                              .description('Valid token generated on account/token')
        }).unknown(),
      }
    }
  },
  {
    method: 'POST',
    path: '/survey/question',
    handler: RestrictedHandlers.questionSave,
    config: {
      auth: 'token',
      // Include this API in swagger documentation
      description: 'Save question',
      notes: ' ',
      tags: ['api', 'survey'],
      plugins: {
        oracledb: true,
        'hapi-swagger': {
          payloadType: 'form',
          responses: {
            '200': {
              'description': 'Valid token',
              'schema': 
                    Joi.object({
                      "comment1"    : Joi.string(),
                      "comment2"    : Joi.string(),
                    })
                  .label('survey_question_list')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                "statusCode": 400,
                "error": "Bad Request",
                "message": "Bad HTTP authentication header format"
              })
            },
            '401': {
              'description': 'Authentication failed',
              'schema': Joi.object({
                        "statusCode": 401,
                        "error": "Unauthorized",
                        "message": "Invalid signature received for JSON Web Token validation",
                        "attributes": {
                          "error": "Invalid signature received for JSON Web Token validation"
                        }
                      })
            }
          }
        }
      },
      validate: {
        headers: Joi.object({
         'authorization': Joi.string()
                              .required()
                              .default(`Bearer ${process.env.TEST_TOKEN}`)
                              .description('Valid token generated on account/token')
        }).unknown(),
        payload: Joi.object({
          "comment1"    : Joi.string().allow('',null),
          "comment2"    : Joi.string().allow('',null),
        })
        .label('survey_question_answer')
      }
    }
  }
];

module.exports = internals;
