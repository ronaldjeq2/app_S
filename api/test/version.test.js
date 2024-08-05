'use strict';
require('dotenv').config();
const Lab = require('lab');
const { expect, } = require('code');
const HapiServer = require('../src/config/hapi');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const Apiresponse = require('../src/testingResponse.json');
// const lab = (exports.lab = Lab.script());
// const experiment = lab.experiment;
// const test = lab.test;
//const Code = require('code')
//const Snapshot = require('snapshot');


describe('GET /version specific wit parameter valid', () => {
    let server;

    beforeEach(async () => {
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            server.stop({ timeout: 10 * 1000 }, () => {
                process.exit(0)
            })
        }
        catch (e) {
            console.log('catch', e)
        }
    });



    it('responds with 200', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });
        const res = await server.inject({
            method: 'get',
            url: '/version/app/1.6',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        // console.log(res);
        expect(res.statusCode).to.equal(200);
    });
});

describe('GET /version specific with version not mapped', () => {
    let server;

    beforeEach(async () => {
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            server.stop({ timeout: 10 * 1000 }, () => {
                process.exit(0)
            })
        }
        catch (e) {
            console.log('catch', e)
        }
    });



    it('responds with 200', async () => {
        const version = 3
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });
        const res = await server.inject({
            method: 'get',
            url: `/version/app/${version}`,
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        // console.log(res);
        expect(res.result).to.equal({});
    });
});




describe('GET /version specific with version invalid', () => {
    let server;

    beforeEach(async () => {
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            server.stop({ timeout: 10 * 1000 }, () => {
                process.exit(0)
            })
        }
        catch (e) {
            console.log('catch', e)
        }
    });



    it('responds with 200', async () => {
        const version = 'asd'
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });
        const res = await server.inject({
            method: 'get',
            url: `/version/app/${version}`,
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        // console.log(res);
        expect(res.result).to.equal({});
    });
});

describe('GET /list versions status', () => {
    let server;

    beforeEach(async () => {
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            server.stop({ timeout: 10 * 1000 }, () => {
                process.exit(0)
            })
        }
        catch (e) {
            console.log('catch', e)
        }
    });



    it('responds with 200', async () => {
        const version = 'asd'
        const res = await server.inject({
            method: 'get',
            url: `/version/app/listVersion`,
        });
        //const snapshot = Snapshot('does some work', res);

        expect(res.statusCode).to.equal(200);
    });
});
