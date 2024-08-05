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

describe('GET /account/phones', () => {
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



    it('list phones with responds  200', async () => {
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });

        expect(res.statusCode).to.equal(200);
    });
});

describe('Complete Validation phones with correct params', () => {
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



    it('phone with 200', async () => {
        let thirdLength, secondValidation, secondLength, firstValidation, idPhone
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },

        });
        const firstLength = firstList.result.length;

        await server.inject({
            method: 'post',
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '961236852',
            }

        }).then(addedPhone => {

            idPhone = addedPhone.result.phone_id;
            expect(addedPhone.result).to.contain({
                phone_number: '961236852',
                phone_type_code: 'CE',
            });
            return server.inject({
                method: 'get',
                url: '/account/phones',
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },

            })
        }).then(secondlist => {
            secondLength = secondlist.result.length;
            firstValidation = secondLength > firstLength;
            return server.inject({
                method: 'post',
                url: ` /account/phones/${idPhone}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })

        }).then(sendMessage => {
            const verifyCode = sendMessage.result.verification_code;
            expect(sendMessage.result).to.contain({
                type_code: 'CE',
                phone_number: '961236852',
                is_verified: false,
            });
            return server.inject({
                method: 'post',
                url: `/account/phones/${idPhone}/actions/validate_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    verification_code: verifyCode
                }
            })
        }).then(verifyCode => {
            expect(verifyCode.result).to.contain({
                phone_number: '961236852',
                is_verified: true,
            });
            return server.inject({
                method: 'delete',
                url: `/account/phones/${idPhone}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(deletedPhone => {
            expect(deletedPhone.result).to.contain({
                phone_number: '961236852',
                phone_type_code: 'CE',
            });

            return server.inject({
                method: 'get',
                url: '/account/phones',
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

describe('Complete Validation phones with correct params', () => {
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
        let messageError, idPhone;
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '961236852',

            }

        }).then(addedPhone => {
            idPhone = addedPhone.result.phone_id;
            return server.inject({
                method: 'post',
                url: ` /account/phones/${idPhone}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            return server.inject({
                method: 'post',
                url: `/account/phones/${idPhone}/actions/validate_verification_code`,
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
                url: `/account/phones/${idPhone}`,
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

describe('Complete Validation phones with correct params', () => {
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

    it('phone was validated', async () => {
        let idPhone, errorResponse, verifyCode
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '961236853',
            }
        }).then(addedPhone => {
            idPhone = addedPhone.result.phone_id;
            return server.inject({
                method: 'post',
                url: ` /account/phones/${idPhone}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            verifyCode = sendMessage.result.verification_code
            return server.inject({
                method: 'post',
                url: `/account/phones/${idPhone}/actions/validate_verification_code`,
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
                url: `/account/phones/${idPhone}/actions/validate_verification_code`,
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
                url: `/account/phones/${idPhone}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'El número de teléfono 961236853 ya fue verificado' });
    });
});

describe('Complete Validation phone with correct params', () => {
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



    it('phone was deleted', async () => {
        let idPhone, errorResponse, verifyCode
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '961236852',
            }
        }).then(addedPhone => {
            idPhone = addedPhone.result.phone_id;
            return server.inject({
                method: 'post',
                url: ` /account/phones/${idPhone}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            verifyCode = sendMessage.result.verification_code
            return server.inject({
                method: 'delete',
                url: `/account/phones/${idPhone}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(deletedEmail => {

            return server.inject({
                method: 'post',
                url: `/account/phones/${idPhone}/actions/validate_verification_code`,
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
        expect(errorResponse.error).to.equal({ message: 'No se econtró el teléfono registrado' });
    });
});

describe('Complete Validation phone with correct params', () => {
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



    it('phone invalid', async () => {
        let idPhone, errorResponse, verifyCode
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '961236852',
            }
        }).then(addedPhone => {
            idPhone = addedPhone.result.phone_id;
            return server.inject({
                method: 'post',
                url: ` /account/phones/${idPhone}/actions/send_verification_code`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(sendMessage => {
            verifyCode = sendMessage.result.verification_code
            return server.inject({
                method: 'post',
                url: `/account/phones/U2FsdGVkX19Y%2BI3EmrSZUzT7n73uHasOX8JR5usw5TU%3D/actions/validate_verification_code`,
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
                url: `/account/phones/${idPhone}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'No se econtró el teléfono registrado' });
    });
});

describe('Complete Validation phone with correct params', () => {
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



    it('phone deleted two times', async () => {
        let idPhone, errorResponse, verifyCode
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '961236853',
            }
        }).then(addedPhone => {
            idPhone = addedPhone.result.phone_id;
            return server.inject({
                method: 'delete',
                url: `/account/phones/${idPhone}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(firstDelete => {
            return server.inject({
                method: 'delete',
                url: `/account/phones/${idPhone}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).then(secondtDelete => {
            errorResponse = secondtDelete.result;
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'No se encontro el teléfono seleccionado' });
    });
});

describe('Complete Validation phone with correct params', () => {
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
        let idPhone, errorResponse, verifyCode
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '961236853',
            }
        }).then(addedPhone => {
            idPhone = addedPhone.result.phone_id;
            return server.inject({
                method: 'post',
                url: '/account/phones',
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
                payload: {
                    phone_number: '961236853',
                }
            })
        }).then(reAddPhone => {
            errorResponse = reAddPhone.result;
            return server.inject({
                method: 'delete',
                url: `/account/phones/${idPhone}`,
                headers: {
                    Authorization: `Bearer ${login.headers.authorization}`,
                },
            })
        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'Ya tienes ese número registrado' });
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
        let idPhone, errorResponse, verifyCode
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
            url: '/account/phones',
            headers: {
                Authorization: `Bearer ${login.headers.authorization}`,
            },
            payload: {
                phone_number: '459602754',
            }
        }).then(addedPhone => {
            errorResponse = addedPhone.result;

        }).catch(e => {
            console.log(e)
        });
        expect(errorResponse.error).to.equal({ message: 'El número \'459602754\' no tiene un formato de celular valido' });
    });
});
