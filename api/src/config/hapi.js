/**
 * # Hapi.js
 *
 * This is a configuration for Hapi
 *
 */
"use strict";
/**
 * ## Imports
 *
 */
const //Hapi itself
    Hapi = require("hapi"),
    // the authentication strategy
    JwtAuth = require("../auth/jwt-strategy"),
    // kind of like underscore, but specific to Hapi
    Hoek = require("hoek"),
    // some additional services
    Plugins = require("./plugins"),
    connect = require("./connect"),
    // the routes we'll support
    Routes = require("./routes");
const oracledb = require("oracledb");

let server = Hapi.server({
    port: process.env.NODE_PORT,
    address: process.env.NODE_IP,
    routes: {
        timeout: { server: 5000, socket: false },
        validate: {
            failAction: async (request, h, err) => {
                if (process.env.NODE_ENV === "production") {
                    // In prod, log a limited error message and throw the default Bad Request error.
                    console.error("ValidationError:", err.message);
                    throw Boom.badRequest(`Invalid request payload input`);
                } else {
                    // During development, log and respond with the full error.
                    console.error(err);
                    throw err;
                }
            }
        }
    }
});

exports.init = async () => {
    await connect.connectStart();
    await server.register(Plugins);
    await JwtAuth.setStrategy(server);
    await Routes.init(server);
    await server.initialize();
    return server;
};
exports.startTest = async () => {
    //await server.register(Plugins);
    //await JwtAuth.setStrategy(server);
    // await Routes.init(server);
    // await connect.connectStart();

    // await server.initialize();

    return server;
};

const startServer = async function () {
    try {
        // add things here before the app starts, like database connection check etc
        await server.start();

        console.log(
            `server started at: ${server.info.uri} with env: ${process.env.NODE_ENV}`
        );

        const gracefulStopServer = async function () {
            connect.stopConnection();
            server.stop({ timeout: 10 * 1000, socket: false }, () => {
                process.exit(0);
            });
        };

        server.ext("onPreAuth", function (request, h) {
            if (
                request.route.realm.pluginOptions.oracledb ||
                request.route.settings.plugins.oracledb
            ) {
                return connect.attachConnection(request, h);
            }
            return h.continue;
        });
        server.events.on("response", function (request, h) {
            if (
                request.route.realm.pluginOptions.oracledb ||
                request.route.settings.plugins.oracledb
            ) {
                return connect.detachConnection(request, h);
            }
        });

        process.on("SIGINT", gracefulStopServer);
        process.on("SIGTERM", gracefulStopServer);
    } catch (error) {
        Hoek.assert(!error, error);
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        process.exit(1);
    }
};

exports.deployment = async () => {
    try {
        await connect.connectStart();
        await server.register(Plugins);
        await JwtAuth.setStrategy(server);
        await Routes.init(server);
    } catch (error) {
        Hoek.assert(!error, error);
        throw error;
    }
    await startServer();

    // // set routes
    return server;
};

process.on("uncaughtException", err => {
    Hoek.assert(!err, err);
    console.log("================ uncaughtException ====================");
    console.log(err);
    console.log("====================================");
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    Hoek.assert(!reason, reason);
    console.log("================ uncaughtException ====================");
    console.log("====================================");
    process.exit(1);
});
