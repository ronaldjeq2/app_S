'use strict';
require('dotenv').config();

const Lab = require('lab');
const { expect } = require('code');
const HapiServer = require('../src/config/hapi');
const { afterEach, beforeEach, describe, it, before } = exports.lab = Lab.script();

const connect = require('../src/config/connect');

describe('GET /student/classtimes', () => {
    let server;
    beforeEach(async () => {
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            await server.stop();

        } catch (e) {
            console.log('error', e)
        }
    });



    it('responds with 400', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        const res = await server.inject({
            method: 'post',
            url: '/student/classtimes',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                start_date: new Date(),
            }

        });
        // Object.values(res.result).map(item => {
        //     expect(item.debt).to.not.equal(null);
        //     expect(item.debt).to.not.equal(undefined);

        // })
        expect(res.statusCode).to.equal(400);
    });
});


describe('GET /student/classtimes', () => {
    let server;
    beforeEach(async () => {
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            await server.stop();

        } catch (e) {
            console.log('error', e)
        }
    });



    it('responds with user without classtimes', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        const res = await server.inject({
            method: 'post',
            url: '/student/classtimes',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                start_date: (new Date()).toISOString().split("T")[0],
            }

        });
        // Object.values(res.result).map(item => {
        //     expect(item.debt).to.not.equal(null);
        //     expect(item.debt).to.not.equal(undefined);

        // })
        expect(res.statusCode).to.equal(200);
        expect(Object.keys(res.result).length).to.equal(0);
    });
});


describe('GET /student/classtimes', () => {
    let server;
    beforeEach(async () => {
        server = await HapiServer.startTest();
    });

    afterEach(async () => {
        try {
            await server.stop();

        } catch (e) {
            console.log('error', e)
        }
    });



    it('responds with user with classtimes', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '1102734',
                password: 'r123456',
            }

        });

        const res = await server.inject({
            method: 'post',
            url: '/student/classtimes',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                start_date: '2019-04-15',
            }

        });
        // Object.values(res.result).map(item => {
        //     expect(item.debt).to.not.equal(null);
        //     expect(item.debt).to.not.equal(undefined);

        // })
        expect(res.statusCode).to.equal(200);
        expect(Object.keys(res.result).length).to.min(1);

    });
});