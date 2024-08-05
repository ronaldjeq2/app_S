'use strict';
require('dotenv').config();
const Lab = require('lab');
const { expect, } = require('code');
const HapiServer = require('../src/config/hapi');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
// const lab = (exports.lab = Lab.script());
// const experiment = lab.experiment;
// const test = lab.test;
//const Code = require('code')
//const Snapshot = require('snapshot');
const connect = require('../src/config/connect');


describe('GET token', () => {
    let server;
    beforeEach(async () => {
        server = await HapiServer.init();

    });

    afterEach(async () => {
        try {
            await server.stop()
        }
        catch (e) {
            console.log('catch', e)
        }
    });



    it('responds with password incorrect', async () => {
        server.ext('onPreAuth', function (request, h) {
            if (request.route.realm.pluginOptions.oracledb || request.route.settings.plugins.oracledb) {
                return connect.attachConnection(request, h);
            }
            return h.continue;

        });
        const res = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '948370',
                password: '1234568',
            }

        });

        server.events.on('response', function (request, h) {
            if (request.route.realm.pluginOptions.oracledb || request.route.settings.plugins.oracledb) {
                return connect.detachConnection(request, h)
            }

        });
        expect(res.result.error).to.equal({
            level: 'INFO',
            type: 'PASSWORD_INCORRECT',
            message: 'Contraseña incorrecta'
        });
    });

});


describe('GET token', () => {
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
        // server.ext('onPreAuth', function (request, h) {
        //     if (request.route.realm.pluginOptions.oracledb || request.route.settings.plugins.oracledb) {
        //         return connect.attachConnection(request, h);
        //     }
        //     return h.continue;

        // });
        const res = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '1102734',
                password: '100200',
            }

        });
        expect(res.statusCode).to.equal(200);
    });
});



describe('GET token', () => {
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



    it('responds with user not exist', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '0',
                password: '100200',
            }

        });
        expect(res.result.error).to.equal({
            level: 'INFO',
            type: 'USER_NOT_EXIST',
            message: 'El usuario no existe'
        });
    });
});


describe('GET UserInfo', () => {
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



    it('responds with validToken', async () => {
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
            url: '/account/info',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        expect(res.statusCode).to.equal(200);
    });
});


describe('GET UserInfo', () => {
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



    it('responds without Authorization', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/account/info',
        });
        expect(res.result).to.equal({
            statusCode: 401,
            error: 'Unauthorized',
            message: 'Missing authentication'
        });
    });
});


describe('GET UserInfo', () => {
    let server, response;

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



    it('responds Only Student', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '1102734',
                password: '100200',
            }

        });
        const res = await server.inject({
            method: 'post',
            url: '/account/info',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        if (res.result.hasStudentCard) {
            response = await server.inject({
                method: 'get',
                url: `/student/${res.result.id}/card/photo`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            });
            expect(response.statusCode).to.equal(200);

        }
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.contains({ 'workerDetail': {} });
        expect(res.result.careerDetail).to.not.equal({})

    });
});

describe('GET UserInfo', () => {
    let server, response, responseWorker;

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



    it('responds  Worker and student', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '871629',
                password: 'megaflama96',
            }

        });
        const res = await server.inject({
            method: 'post',
            url: '/account/info',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        if (res.result.hasStudentCard) {
            response = await server.inject({
                method: 'get',
                url: `/student/${res.result.id}/card/photo`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            });
            expect(response.statusCode).to.equal(200);

        }
        if (res.result.haswORKCard) {
            responseWorker = await server.inject({
                method: 'get',
                url: `/employee/${res.result.id}/card/photo`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            });
            expect(responseWorker.statusCode).to.equal(200);

        }
        expect(res.statusCode).to.equal(200);
        expect(res.result.workerDetail).to.not.equal({})
        expect(res.result.careerDetail).to.not.equal({})


    });
});

describe('GET UserInfo', () => {
    let server, responseWorker;

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



    it('responds  Only worker ', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '1143648',
                password: '090790',
            }

        });
        const res = await server.inject({
            method: 'post',
            url: '/account/info',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        if (res.result.haswORKCard) {
            responseWorker = await server.inject({
                method: 'get',
                url: `/employee/${res.result.id}/card/photo`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            });
            expect(responseWorker.statusCode).to.equal(200);

        }
        expect(res.statusCode).to.equal(200);
        expect(res.result.workerDetail).to.not.equal({})
        expect(res.result.careerDetail).to.equal({})


    });
}); 