"use strict";

let internals = {};

const versionApp = {
    "1.10": {
        Lanzamiento: "Lanzamiento 20-Set-2019",
        detail: {
            notificationList: `Ahora puedes ver todas tus alertas con la opción notificaciones`,
            AppRelease: `Correción de errores y mejora de rendimiento`
        }
    },
    "1.9": {
        Lanzamiento: "Lanzamiento 19-Nov-2018",
        detail: {
            fotocheck: `Fotocheck para el trabajador`,
            updateAlert: `Notificación automática para actualizar la app`,
            courseSchedule: `Correción de errores y mejora de rendimiento`
        }
    },
    "1.8": {
        Lanzamiento: "Lanzamiento 15-Nov-2018",
        detail: {
            assistantDetail:
                "Lista de asistencias: Ahora puedes ver tu registro de asistencias de los cursos vigentes",
            careerDetail: `Detalle de la carrera y curriculum: Ahora puedes ver los detalles de tu carrera y curriculum de acuerdo a tu periodo vigente en la opción de datos personales`,
            course: `Ahora puedes ver la informaciòn de tus cursos con la opciòn offline`
        }
    },

    "1.7": {
        Lanzamiento: "Lanzamiento 31-Oct-2018",
        detail: {
            paymentSchedule:
                "Cronograma de pagos: puedes revisar tu cronograma de pagos, por periodo, y buscar los cronogramas de los periodos anteriores. Además, puedes escoger tu banco favorito para mantenerlo en la pantalla principal",
            courseSchedule: `Horario por curso: hemos mejorado la sección de "Mis cursos": ahora tienes la sección de horario, donde puedes ver el horario conciso por cada curso que tienes en tu periodo.`,
            performance: "También hemos hecho mejoras de rendimiento en la App."
        }
    },

    "1.6": {
        Lanzamiento: "Lanzamiento 18-Sep-2018",
        detail: {
            fotocheck:
                "Fotocheck extendido: Ahora todos los programas contaran con fotocheck virtual dentro de la APP.",
            offline:
                "Modo sin conexion: Podras usar varias de las caracteristicas de la APP sin tener que estar conectado a internet permanentemente.",
            notification:
                "Ahora estarás más enterado de lo que pasa en SENATI con la nueva funcionalidad de notificaciones integrada. Requiere permiso de ubicación.",
            codeRefactor:
                "Hemos hecho mejoras internas e externas para mejorar tu experiencia de usuario y la estabilidad de la APP."
        }
    }
};

const listVersion = {
    "1.6.2": {
        forceUpdate: false,
        sugestUpdate: true
    },

    "1.7.0": {
        forceUpdate: false,
        sugestUpdate: true
    },

    "1.7.1": {
        forceUpdate: false,
        sugestUpdate: true
    },
    "1.7.3": {
        forceUpdate: false,
        sugestUpdate: true
    },

    "1.8.0": {
        forceUpdate: false,
        sugestUpdate: true
    },
    "1.8.2": {
        forceUpdate: false,
        sugestUpdate: true
    },
    "1.9.0": {
        forceUpdate: false,
        sugestUpdate: true
    },
    "1.9.2": {
        forceUpdate: false,
        sugestUpdate: false
    }
};

internals.checkVersion = function (request, h) {
    try {
        return (listVersion);
    } catch (error) { }
};

internals.getVersionDetail = function (request, h) {
    let credentials = request.auth.credentials;
    const { version } = request.params;

    try {
        return (versionApp[version] || {});
    } catch (error) {
        console.log(`idAlumno: ${credentials.pid}`);
        console.log(error);
        return (
            Boom.badImplementation(
                `Error desconocido en getVersionDetail on ID ${credentials.pid}`
            )
        );
    }
};

module.exports = internals;
