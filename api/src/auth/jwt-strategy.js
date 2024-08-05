/**
 * # jwt-strategy.js
 *
 */
'use strict';
/**
* ## Imports
*
*/
const
    //the authentication package
    Jwt = require('jsonwebtoken'),
    //redis for blacklisting tokens
    redisClient = require('../database/redis');
// //mongoose user object
// User = require('../database/models/User.js');

let internals = {};
// private key for signing
internals.privateKey = process.env.CRYPTO_PRIVATE_KEY;

/**
 *
 * ## validate
 *
 * When a route is configured w/ 'auth', this validate function is
 * invoked
 *
 * If the token wasn't invalidated w/ logout, then validate
 * its for a user
 *
 * When a user logs out, the token they were using is saved to Redis
 * and checked here to prevent re-use
 *
 */
internals.validate = async function (decodedToken, request, h) {

    var credentials = {};
    let isCorrect = false;

    //let isValid;
    //credentials have 'Bearer dfadfsdf'
    var headers = request.headers.authorization.split(' ');
    if (headers.length === 2) {
        //does redis have the token
        isCorrect = redisClient.get(headers[1], function (err, h) {
            if (err) {
                console.log('error', err)
                return false;

                // return (err, false, credentials);
            }
            //oops - it's been blacklisted - sorry
            if (h || !decodedToken.hash) {
                credentials = decodedToken;
                request.auth.credentials = decodedToken
                return true;
            }
            // ok - valid token, do we have a user?
            // note we're only using 'id' - that's because
            // the user can change their email and username
            // User.findById(decodedToken.id, function (err, user) {

            // if (err) {
            // return callback(err, false, credentials);
            // } else {
            // credentials = decodedToken;
            // }
            // });
        });
        return { isValid: isCorrect };
    }



};

// create token
internals.createToken = function (obj) {
    return Jwt.sign(obj, internals.privateKey);
};

// set jwt auth strategy
internals.setJwtStrategy = function (server) {
    //console.log('asd', server.auth.strategy)
    server.auth.strategy('token', 'jwt', {
        key: internals.privateKey,
        validate: internals.validate
    });
};

module.exports = {
    setStrategy: internals.setJwtStrategy,
    createToken: internals.createToken
};
