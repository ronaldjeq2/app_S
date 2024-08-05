/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
"use strict";
require("../../common/utils");

const Boom = require("boom"),
    oracledb = require("oracledb"),
    aguid = require("aguid");
const axios = require("axios");

let internals = {};

internals.getPlaces = async function (request, h) {

    try {
        const db = request.mongo.db;
        const myCollection = db.collection('campus');
        const ArrayPlaces = [];
        const ArrayMarkers = [];
        return myCollection.find().toArray()
            .then(result => {
                result.map(async item => {
                    if (!ArrayMarkers.includes(`${item.latitud}_${item.longitud}`)) {
                        ArrayPlaces.push({
                            codigoSede: item.codigoSede,
                            descripcion: item.descripcion,
                            direccion: item.direccion,
                            marker: {
                                latitude: item.latitud,
                                longitude: item.longitud,
                            }
                        })
                        ArrayMarkers.push(`${item.latitud}_${item.longitud}`)
                    }
                })
                return ArrayPlaces
            }).catch(e => {
                Boom.boomify(e);
            });
    }
    catch (e) {
        console.log(e);
        Boom.boomify(e);
    }
};


module.exports = internals;
