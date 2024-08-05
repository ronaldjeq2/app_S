/**
 * # news/endpoints.js
 *
 * To scrapper and get news from oficial web page
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
//Handle the endpoints
const NewsHandlers = require('./handlers'),
      //Joi is Hapi's validation library
      Joi = require('joi');
      

let internals = {};
/**
 * ## Set the method, path, and handler
 */
internals.endpoints = [
  {
    method: 'GET',
    path: '/news/getList/{page}',
    config: {
      auth: 'token',
      handler: NewsHandlers.getList,
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      
      // Include this API in swagger documentation
      description: 'Get the list of news per page',
      notes: 'asd',
      tags: ['api', 'news'],
      
      plugins: {
        oracledb: true,
        'hapi-swagger': {
          payloadType: 'form',
        }
      },
      
      validate: {
        headers: Joi.object({
          'authorization': Joi.string()
                              .required()
                              .default(`Bearer ${process.env.TEST_TOKEN}`)
                              .description('Valid token generated on account/token')
        }).unknown(),

        params: {
          page: Joi.number().integer().default(0),
        }

      }

    }
  },
  
  {
    method: 'POST',
    path: '/news/get',
    config: {
      auth: 'token',
      handler: NewsHandlers.get,
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      },
      
      // Include this API in swagger documentation
      description: 'Get one detalied new',
      notes: 'asd',
      tags: ['api', 'news'],
      
      plugins: {
        oracledb: true,
        'hapi-swagger': {
          payloadType: 'form',
        }
      },
      
      validate: {
        headers: Joi.object({
          'authorization': Joi.string()
                              .required()
                              .default(`Bearer ${process.env.TEST_TOKEN}`)
                              .description('Valid token generated on account/token')
        }).unknown(),
        
        payload: {
          href: Joi.string().default('/noticias/senati-ocupo-2do-y-3er-lugar-en-x-olimpiadas-academicas-de-mecatronica-2017'),
        }

      }
    }
  }
];

module.exports = internals;
