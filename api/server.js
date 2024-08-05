/**
 *  # senati app server
 */

require('dotenv').config();
// kind of like underscore, but specific to Hapi
const Hoek = require('hoek'),
    HapiServer = require('./src/config/hapi'),
    connect = require('./src/config/connect');
const oracledb = require('oracledb');

/**
 * Hapi will be the NodeJS server.
 *
 * From the command line, run ```npm start```
 *
 *  Hapi is configured in this import
 */


HapiServer.deployment();

