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

describe('GET /account/emails', () => {
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
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });

        expect(res.statusCode).to.equal(200);
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email with 200', async () => {
        let thirdLength, secondValidation, secondLength, firstValidation, idEmail
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });
        const firstList = await server.inject({
            method: 'get',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        const firstLength = firstList.result.length;

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq@gmail.com',
                email_type_code: 'PREF',
            }

        }).then(addedEmail => {

            idEmail = addedEmail.result.email_id;
            expect(addedEmail.result).to.contain({
                email_type_code: 'PREF',
                email_type_description: 'PREFERIDO',
                email_address: 'ronaldjeq@gmail.com',
            });
            return server.inject({
                method: 'get',
                url: '/account/emails',
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            })
        }).then(secondlist => {
            secondLength = secondlist.result.length;
            firstValidation = secondLength > firstLength;
            return server.inject({
                method: 'post',
                url: ` /account/emails/${idEmail}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })

        }).then(sendMessage => {
            const verifyCode = sendMessage.result.verification_code
            expect(sendMessage.result).to.contain({
                email_type_code: 'PREF',
                email_address: 'ronaldjeq@gmail.com',
                is_verified: false,
                verification_pidm: 111012,
            });
            return server.inject({
                method: 'post',
                url: `/account/emails/${idEmail}/actions/validate_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    verification_code: verifyCode
                }
            })
        }).then(verifyCode => {
            expect(verifyCode.result).to.contain({
                email_type_code: 'PREF',
                email_address: 'ronaldjeq@gmail.com',
                is_verified: true,
            });
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(deletedEmail => {
            expect(deletedEmail.result).to.contain({
                email_address: 'ronaldjeq@gmail.com',
                email_type_code: 'PREF'
            });

            return server.inject({
                method: 'get',
                url: '/account/emails',
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            })
        }).then(thirdList => {
            thirdLength = thirdList.result.length;
            secondValidation = thirdLength === firstLength;
        }).catch(e => {
            console.log(e)
        });
        expect(secondValidation && firstValidation).to.equal(true);
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('incorrect verification code', async () => {
        let messageError, idEmail;
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });


        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq2@gmail.com',
                email_type_code: 'PREF',
            }

        }).then(addedEmail => {
            idEmail = addedEmail.result.email_id;
            return server.inject({
                method: 'post',
                url: ` /account/emails/${idEmail}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            return server.inject({
                method: 'post',
                url: `/account/emails/${idEmail}/actions/validate_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    verification_code: '000001'
                }
            })
        }).then(verifyCode => {
            messageError = verifyCode.result
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(deletedEmail => {
            return server.inject({
                method: 'get',
                url: '/account/emails',
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            })
        }).catch(e => {
            console.log(e)
        });
        expect(messageError.error).to.equal({ message: 'El codigo de verificacion ingresado no es correcto' });
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email was validated', async () => {
        let idEmail, errorResponse, verifyCode
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq3@gmail.com',
                email_type_code: 'PREF',
            }
        }).then(addedEmail => {
            idEmail = addedEmail.result.email_id;
            return server.inject({
                method: 'post',
                url: ` /account/emails/${idEmail}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            verifyCode = sendMessage.result.verification_code
            return server.inject({
                method: 'post',
                url: `/account/emails/${idEmail}/actions/validate_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    verification_code: verifyCode
                }
            })
        }).then(firstVerification => {
            return server.inject({
                method: 'post',
                url: `/account/emails/${idEmail}/actions/validate_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    verification_code: verifyCode
                }
            })
        }).then(secondVerification => {
            errorResponse = secondVerification.result;
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'El correo ronaldjeq3@gmail.com ya fue verificado' });
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email was deleted', async () => {
        let idEmail, errorResponse, verifyCode
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq3@gmail.com',
                email_type_code: 'PREF',
            }
        }).then(addedEmail => {
            idEmail = addedEmail.result.email_id;
            return server.inject({
                method: 'post',
                url: ` /account/emails/${idEmail}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            verifyCode = sendMessage.result.verification_code
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(deletedEmail => {

            return server.inject({
                method: 'post',
                url: `/account/emails/${idEmail}/actions/validate_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    verification_code: verifyCode
                }
            })
        }).then(verifyEmail => {
            errorResponse = verifyEmail.result;
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'No se econtro el correo registrado' });
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email invalid', async () => {
        let idEmail, errorResponse, verifyCode
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq4@gmail.com',
                email_type_code: 'PREF',
            }
        }).then(addedEmail => {
            idEmail = addedEmail.result.email_id;
            return server.inject({
                method: 'post',
                url: ` /account/emails/${idEmail}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            verifyCode = sendMessage.result.verification_code
            return server.inject({
                method: 'post',
                url: `/account/emails/U2FsdGVkX19d%2F7odX5mM%2FQvX3RwhGCCAXxwFoGYu0xava32SaYMsjBNNoBDuExXr/actions/validate_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    verification_code: verifyCode
                }
            })
        }).then(Verification => {
            errorResponse = Verification.result;
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'No se econtro el correo registrado' });
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email deleted two times', async () => {
        let idEmail, errorResponse, verifyCode
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq5@gmail.com',
                email_type_code: 'PREF',
            }
        }).then(addedEmail => {
            idEmail = addedEmail.result.email_id;
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(firstDelete => {
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(secondtDelete => {
            errorResponse = secondtDelete.result;
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'No se encontro el correo seleccionado' });
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email add two times', async () => {
        let idEmail, errorResponse, verifyCode
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq6@gmail.com',
                email_type_code: 'PREF',
            }
        }).then(addedEmail => {
            idEmail = addedEmail.result.email_id;
            return server.inject({
                method: 'post',
                url: '/account/emails',
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    email_address: 'ronaldjeq6@gmail.com',
                    email_type_code: 'PREF',
                }
            })
        }).then(reAddEmail => {
            errorResponse = reAddEmail.result;
            return server.inject({
                method: 'delete',
                url: `/account/emails/${idEmail}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'Ya tienes registrado el correo ronaldjeq6@gmail.com' });
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email with email invalid', async () => {
        let idEmail, errorResponse, verifyCode
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq7@gmail',
                email_type_code: 'PREF',
            }
        }).then(addEmail => {
            errorResponse = addEmail.result;

        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'El correo \'ronaldjeq7@gmail\' no tiene un formato valido' });
    });
});

describe('Complete Validation email with correct params', () => {
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



    it('email with type email invalid', async () => {
        let idEmail, errorResponse, verifyCode
        const login = await server.inject({
            method: 'post',
            url: '/account/token',
            payload: {
                username: '111012',
                password: 'r123456',
            }

        });

        await server.inject({
            method: 'post',
            url: '/account/emails',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                email_address: 'ronaldjeq7@gmail',
                email_type_code: 'ASD',
            }
        }).then(addEmail => {
            errorResponse = addEmail.result;

        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'El correo \'ronaldjeq7@gmail\' no tiene un formato valido' });
    });
});