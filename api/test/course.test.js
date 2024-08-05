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

describe('POST /course', () => {
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



    it('responds with 200 and without currentCourse', async () => {
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
            url: '/course',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                inProgressFlag: true,
            }

        });
        expect(res.statusCode).to.equal(200);
    });
});


describe('POST /course', () => {
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



    it('responds with 200 and with historicCourse', async () => {
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
            url: '/course',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                inProgressFlag: false,
            }

        });
        expect(res.statusCode).to.equal(200);
        if (res.result.length > 0) {
            expect(res.result[0].pidm).to.equal(111012);
        }

    });
});

describe('POST /course', () => {
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



    it('responds with 200 and with listCourse for period', async () => {
        const periodo = '201810';
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '948370',
                password: 'r123456',
            }

        });

        const res = await server.inject({
            method: 'get',
            url: `/course/${periodo}/schedule`,
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
        });
        Object.values(res.result).map(item => {
            expect(item.codTerm).to.equal('201810');
        })
        expect(res.statusCode).to.equal(200);



    });
});

describe('POST /course', () => {
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



    it('responds with 200 and with listCourse for period detail', async () => {
        const periodo = '201810';

        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '948370',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'get',
            url: `/course/${periodo}/schedule`,
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
        }).then(listCourseForPeriod => {
            Object.values(listCourseForPeriod.result).map(item => {
                const { nrc } = item;

                const res = server.inject({
                    method: 'get',
                    url: `/course/${periodo}/${nrc}`,
                    headers: {
                        Authorization: `Bearer ${login.headers.authorization}`,
                    },
                }).then(res => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.result.length).to.min(1);
                });


            })
        });




    });
});

describe('POST /course', () => {
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



    it('responds with 200 and with listAssitance of course', async () => {
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '1012535',
                password: 'r123456',
            }

        });

        const res = await server.inject({
            method: 'post',
            url: `/course`,
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                inProgressFlag: true,
            }

        });
        const ListCourse = res.result[0].cursos
        const periodo = res.result[0].periodo
        Object.values(ListCourse).map(item => {
            const nrc = item.nrc
            const assistance = server.inject({
                method: 'get',
                url: `/course/${periodo}/${nrc}/assistance`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    inProgressFlag: true,

                }

            }).then(assistanceResult => {
                if (Object.values(assistanceResult.result).length > 0) {
                    const { totalClass, classAssistance, notRegistered, pending, assistance, noAttendance, assistanceList } = assistanceResult.result;
                    const firstValidation = totalClass === notRegistered + classAssistance;
                    const secondValidation = classAssistance === pending + assistance + noAttendance;

                    expect(assistanceResult.result.period).to.equal(periodo);
                    expect(assistanceResult.result.nrc).to.equal(nrc);
                    expect(totalClass).to.not.equal(null);
                    expect(classAssistance).to.not.equal(null);
                    expect(notRegistered).to.not.equal(null);
                    expect(pending).to.not.equal(null);
                    expect(assistance).to.not.equal(null);
                    expect(noAttendance).to.not.equal(null);
                    expect(Object.keys(assistanceList).length).to.equal(totalClass);
                    expect(firstValidation).to.be.equal(true);
                    expect(secondValidation).to.be.equal(true);
                }
            });
        })
        expect(res.statusCode).to.equal(200);



    });
});