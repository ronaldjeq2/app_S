/**
 * # redis.js
 *
 * This is the configuration for Redis 
 *
 */
'use strict';
/**
 * ## Imports
 *
 */
const Redis = require('redis');

let redisClient = {};
/**
 * ## The connect string for the dev environment
 * @see https://github.com/NodeRedis/node_redis for more information
 *
 */

//running locally - make sure you've started redis server
redisClient = Redis.createClient({
	host: process.env.REDIS_DB_HOST,
	port: process.env.REDIS_DB_PORT
});    

module.exports = redisClient;

