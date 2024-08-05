/**
 * # plugins.js
 *
 * Plugins are like middleware, they get used 'automagically'
 *
 */
"use strict";
var internals = {};
const HapiSwagger = require("hapi-swagger"),
  Inert = require("inert"),
  Vision = require("vision"),
  Hoek = require("hoek"),
  Pack = require("../../package");
const swaggerOptions = {
  info: {
    title: "SENATI - API Documentation",
    version: Pack.version + " - " + process.env.ORACLE_DB_CONN.split("/")[1]
  },

  grouping: "tags"
};
/**
 * ## plugins
 *
 * when a route is config'd with auth, the hapi-auth-jwt will be invoked
 *
 * the good module prints out messages
 */
let plugins = [];

plugins = plugins.concat([
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: {
      info: {
        title: "SENATI - API Documentation",
        version: Pack.version + " - " + process.env.ORACLE_DB_CONN.split("/")[1]
      },
      // securityDefinitions: {
      //   'token': {
      //     'type': 'apiKey',
      //     'name': 'Authorization',
      //     'in': 'header'
      //   }
      // },
      // security: [{ 'token': [] }],
      grouping: "tags"
    }
  }
]);

const mongoDbOpts = {
  url: process.env.MONGO_DB_URL || "mongodb://localhost:27017/test",
  settings: {
    poolSize: 10,
    useNewUrlParser: true
  },
  decorate: true
};

plugins.push(
  {
    plugin: require("hapi-auth-jwt2"),
    options: {}
  },
  {
    plugin: require("hapi-mongodb"),
    options: mongoDbOpts
  },
  {
    plugin: require("good"),
    options: {
      ops: {
        interval: 1000
      },
      reporters: {
        consoleReporter: [
          {
            module: "good-squeeze",
            name: "Squeeze",
            args: [
              {
                log: "*",
                response: "*"
              }
            ]
          },
          {
            module: "good-console"
          },
          "stdout"
        ],
        fileReporter: [
          {
            module: "good-squeeze",
            name: "Squeeze",
            args: [
              {
                response: "*",
                "request-error": "*"
              }
            ]
          },
          {
            module: "good-formatters",
            name: "Apache",
            // pre-defined formats are 'combined', 'common', 'referrer'
            args: [
              {
                format: "common"
              }
            ]
          },
          {
            module: "good-file",
            args: ["./app-server.log"]
          }
        ]
      }
    }
  }
);
module.exports = plugins;
