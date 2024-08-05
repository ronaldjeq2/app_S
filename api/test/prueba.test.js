'use strict';
require('dotenv').config();

const Lab = require('lab');
const { expect } = require('code');
const HapiServer = require('../src/config/hapi');
const { afterEach, beforeEach, describe, it, before } = exports.lab = Lab.script();
// const lab = (exports.lab = Lab.script());
// const experiment = lab.experiment;
// const test = lab.test;
//const Code = require('code')
const connect = require('../src/config/connect');

describe('GET /test', () => {
    // console.log(process.env)
    let server;

    before(async () => {
        //console.log('beforeEach')
        //  return await connect.connectStart();
    });
    beforeEach(async () => {
        //console.log('beforeEach')
        //  console.log(connection)
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            await server.stop();

        } catch (e) {
            console.log('error', e)
        }
    });



    it('responds with 200', async () => {
        //  console.log(connection)

        const res = await server.inject({
            method: 'get',
            url: '/test'
        });

        expect(res.statusCode).to.equal(200);
    });
});
