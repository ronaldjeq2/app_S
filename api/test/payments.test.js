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

describe('GET /payments/term', () => {
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
            url: '/payments/term',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        Object.values(res.result).map(item => {
            expect(item.debt).to.not.equal(null);
            expect(item.debt).to.not.equal(undefined);

        })
        expect(res.statusCode).to.equal(200);
    });
});


describe('GET /payments/term', () => {
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



    it('responds with 200 patrocinado completo', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '1121351',
                password: 'r123456',
            }

        });

        const res = await server.inject({
            method: 'get',
            url: '/payments/term',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        Object.values(res.result).map(item => {
            expect(item.debt).to.equal(0);
            expect(item.debt).to.not.equal(null);
            expect(item.debt).to.not.equal(undefined);

        })
        expect(res.statusCode).to.equal(200);
    });
});
