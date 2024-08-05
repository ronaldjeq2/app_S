/**
 * # routes.js
 *
 * All the routes available are defined here
 * The endpoints describe the method (POST/GET...)
 * and the url ('account/login')
 * and the handler
 *
 */

"use strict";

const glob = require("glob");
const path = require("path");
const _ = require("lodash");

let internals = {};

// add ping route by default for health check
const routes = [
  {
    method: "GET",
    path: "/ping",
    handler: function(request, h) {
      console.log(request.headers);
      console.log(request.info);
      return "pong";
    },
    options: {
      security: true,
      cors: {
        origin: ["https://*.senati.edu.pe"]
      },
      description: "Dummy health check point",
      notes: "Dummy health check point, only verifies if server is alive",
      tags: ["api"]
    }
  }
];

// add all routes from all modules to the routes array manually or write your routes inside a folder inside the server folder
// with suffix as Routes.js e.g weatherRoutes.js
glob.sync("./src/routes/**/endpoints.js").forEach(file => {
  routes.push(require(path.resolve(file)).endpoints);
});

internals.init = function(server) {
  server.route(_.flattenDeep(routes));
};

module.exports = internals;
