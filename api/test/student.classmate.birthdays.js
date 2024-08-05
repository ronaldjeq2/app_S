'use strict';
require('dotenv').config();

const Lab = require('lab');
const { expect } = require('code');
const HapiServer = require('../src/config/hapi');
const { afterEach, beforeEach, describe, it, before } = exports.lab = Lab.script();

const connect = require('../src/config/connect');

describe('GET /student/classmate/birthdays', () => {
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



    it('responds without Info', async () => {
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
            url: '/student/classmate/birthdays',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                ref_date: '2019-04-15',
            }

        });
        expect(res.statusCode).to.equal(200);
        expect((res.result).length).to.equal(0);

    });
});

describe('GET /student/classmate/birthdays', () => {
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



    it('responds with 200 and list exist', async () => {
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
            url: '/student/classmate/birthdays',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                ref_date: '2019-04-15',
            }

        });
        expect(res.statusCode).to.equal(200);
        expect((res.result).length).to.min(1);

    });
});
