/**
 * # restricted/handlers.js
 *
 * Display simple message if user has access
 *
 */
"use strict";
require("../../common/utils");

const Boom = require("boom"),
  oracledb = require("oracledb"),
  aguid = require("aguid");
const fnsFormat = require("date-fns/format");
const fnsESLocale = require("date-fns/locale/es");
const api_assistance = require("../../database/banner_api/st_assistance");

let internals = {};
/**
 *
 * note: the user name is available from the credentials!
 */
internals.getListOfCourses = function(request, h) {
  const credentials = request.auth.credentials;

  const idAlumno = credentials.pid;

  const inProgressFlag = request.payload.inProgressFlag ? "1" : "0";
  try {
    const response = request.app.db
      .execute(
        ...[
          `
        SELECT * FROM table(SENATI.gwzwapp.f_cursos_id_tbl( :idAlumno, :historyFlag ))
      `,
          {
            idAlumno: {
              dir: oracledb.BIND_IN,
              type: oracledb.STRING,
              maxSize: 9,
              val: idAlumno
            },
            historyFlag: {
              dir: oracledb.BIND_IN,
              type: oracledb.STRING,
              maxSize: 1,
              val: inProgressFlag
            }
          },
          { outFormat: oracledb.OBJECT }
        ]
      )

      .then(data => {
        let carreras = {};

        data.rows.map(row => {
          let id = [row["CARRERA"], row["PERIODO"], row["PROGRAMA"]]
            .join("-")
            .toLowerCase()
            .removeAccents();

          if (carreras[id] === undefined) {
            carreras[id] = {
              idCarrera: id,
              idAlumno: row["ID"],
              pidm: row["PIDM"],
              programa: row["PROGRAMA"],
              carrera: row["CARRERA"],
              periodo: row["PERIODO"],
              cursos: []
            };
          }

          carreras[id].cursos.push({
            nrc: row["NRC"],
            titulo: row["CURSO"],
            nota: row["NOTA"],
            isVirtual: row["ES_VIRTUAL"] === "Y",
            // Only show aprobado on History courses
            aprobado: request.payload.inProgressFlag
              ? null
              : row["APROBADO"] === "Y"
          });
        });

        return Object.values(carreras);
      })

      .catch(error => {
        console.log(`idAlumno: ${credentials.pid}`);
        console.log(error);
        return Boom.badImplementation(
          `Error desconocido en getListOfCourses on ID ${credentials.pid}`,
          credentials.pid
        );
      });
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
};

internals.getCourseDetail = function(request, h) {
  const credentials = request.auth.credentials;

  const idAlumno = credentials.pidm;

  const { nrc, periodo } = request.params;
  try {
    const response = request.app.db
      .execute(
        ...[
          `
        SELECT * FROM table(SENATI.gwzwapp.f_detalle_cursos_tbl( :idAlumno, :periodo, :nrc ))
      `,
          {
            idAlumno: {
              dir: oracledb.BIND_IN,
              type: oracledb.NUMBER,
              maxSize: 9,
              val: idAlumno
            },
            periodo: {
              dir: oracledb.BIND_IN,
              type: oracledb.STRING,
              maxSize: 6,
              val: periodo
            },
            nrc: {
              dir: oracledb.BIND_IN,
              type: oracledb.STRING,
              maxSize: 5,
              val: nrc
            }
          },
          { outFormat: oracledb.OBJECT }
        ]
      )

      .then(data => {
        const componentList = [];

        data.rows.map(component => {
          componentList.push({
            titulo: component["TITULO_COMPONENTE"],
            peso: component["PESO_COMPONENTE"].pad(2),
            calificacion: component["CALIFICIACION_COMPONENTE"],
            debePasar: component["DEBE_PASAR"] === "Y",
            debePasarDescripcion: "Obligatorio para aprobar",
            instructorNombre: component["NOMBRE_INSTRUCTOR"]
          });
        });

        return componentList;
      })

      .catch(error => {
        console.log(`idAlumno: ${credentials.pid}`);
        console.log("Params", request.params);
        console.log(error);
        return Boom.badImplementation(
          `Error desconocido en getCourseDetail on ID ${credentials.pid}`,
          credentials.pid
        );
      });
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
};

internals.getDefinitions = function(request, h) {
  const data = {
    AJ: "Error administrativo",
    DD: "NRC borrado",
    DE: "Desaprobado",
    "DESAP.": "Desaprobado",
    RE: "Retiro",
    RI: "Ajuste",
    WA: "Retiro autorizado",
    WN: "Abandono de periodo",
    WS: "Reserva de vacante"
  };

  return data;
};
function verifyData(info) {
  const isCorrect = typeof info === "string" && info.trim().length > 0;

  return isCorrect;
}

internals.getScheduleByTerm = function(request, h) {
  const credentials = request.auth.credentials;

  const idAlumno = credentials.pidm;

  const { periodo } = request.params;
  try {
    const response = request.app.db
      .execute(
        ...[
          `
        select * from table(senati.gwzwapp.f_horario_conciso_tbl(:n_p_pidm ,:v_p_term ))`,
          {
            n_p_pidm: {
              dir: oracledb.BIND_IN,
              type: oracledb.NUMBER,
              maxSize: 9,
              val: idAlumno
            },
            v_p_term: {
              dir: oracledb.BIND_IN,
              type: oracledb.STRING,
              maxSize: 6,
              val: periodo
            }
          },
          { outFormat: oracledb.OBJECT }
        ]
      )

      .then(data => {
        const scheduleByCourse = {};
        data.rows.map(row => {
          const courseId = row["NRC"];

          if (scheduleByCourse[courseId] === undefined) {
            scheduleByCourse[courseId] = {
              codTerm: row["PERIODO"],
              nrc: row["NRC"],
              startDate: new Date(row["INICIO"]),
              finishDate: new Date(row["FIN"]),
              schedule: []
            };
          }

          scheduleByCourse[courseId].schedule.push({
            key: aguid(),
            weekDayList: verifyData(row["DIAS"])
              ? row["DIAS"]
                  .toUpperCase()
                  .replace(/I/gi, "X")
                  .split("")
              : [""],
            classTime: verifyData(row["HORA"]) ? row["HORA"] : " ",
            location: verifyData(row["UBICACION"]) ? row["UBICACION"] : "--",
            instructor: verifyData(row["INSTRUCTOR"]) ? row["INSTRUCTOR"] : " ",
            existData: verifyData(row["HORA"]) || verifyData(row["DIAS"])
          });
        });
        return scheduleByCourse;
      })

      .catch(error => {
        console.log(`idAlumno: ${credentials.pid}`);
        console.log("Params", request.params);
        console.log(error);
        return Boom.badImplementation(
          `Error desconocido en getCourseDetail on ID ${credentials.pid}`,
          credentials.pid
        );
      });
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
};

internals.getAssistanceDetail = function(request, h) {
  const assistance = {
    period: "",
    nrc: "",
    totalClass: 20,
    classAssistance: 10,
    notRegistered: 0,
    pending: 0,
    assistance: 6,
    noAttendance: 4,
    lastAssistance: "2018-05-05",
    lastClass: "2018-05-05",
    assistanceList: {}
  };
  try {
    const credentials = request.auth.credentials;

    const idAlumno = credentials.pidm;

    const { periodo, nrc } = request.params;
    const response = request.app.db
      //Assitance Summary
      .execute(...api_assistance.get_assistance_summary(idAlumno, periodo, nrc))

      .then(result => {
        if (result.rows.length > 0) {
          const row = result.rows[0];

          assistance.period = row["PERIODO"];
          assistance.nrc = row["NRC"];
          assistance.totalClass = row["TOTAL_CLASES"];
          assistance.classAssistance = row["CLASES_CON_ASISTENCIA"];
          assistance.notRegistered = row["NO_REGISTRADA"];
          assistance.pending = row["PENDIENTE_TOMA"];
          assistance.assistance = row["ASISTENCIAS_ALU"];
          assistance.noAttendance = row["INASISTENCIAS_ALU"];
          assistance.lastAssistance = transforLastAssistance(
            row["ULT_REG_ASISTENCIA"],
            false
          );
          assistance.lastClass = transforLastAssistance(
            row["FECHA_ULT_CLASE"],
            false
          );
        } else {
          console.log("else");
          return { rows: [] };
        }
        return request.app.db.execute(
          ...api_assistance.get_assistance_detail(idAlumno, periodo, nrc)
        );
      })
      .then(result => {
        if (result.rows.length > 0) {
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows[i];

            const dateAssistance = transforLastAssistance(row["FECHA"], true);
            const register = row["TIPO_REGISTRO"];
            const {
              keyDay,
              assistanceDate,
              dayName,
              dayShort
            } = dateAssistance;
            assistance["assistanceList"][keyDay] =
              assistance["assistanceList"][keyDay] || {};
            assistance["assistanceList"][keyDay][
              "assistanceDate"
            ] = assistanceDate;
            assistance["assistanceList"][keyDay]["dayName"] = dayName;
            assistance["assistanceList"][keyDay]["dayShort"] = dayShort;
            assistance["assistanceList"][keyDay]["type"] = register;
          }
          return assistance;
        } else {
          //assistance={};
          return {};
        }
      })

      .catch(error => {
        console.log(`idAlumno: ${credentials.pid}`);
        console.log("Params", request.params);
        console.log(error);
        return Boom.badImplementation(
          `Error desconocido en getAssistanceDetail on ID ${credentials.pid}`,
          credentials.pid
        );
      });
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
};
function transforLastAssistance(assistanceDate, moreValues) {
  const values = {};
  const newFormateDate = assistanceDate
    .toISOString()
    .split("T")[0]
    .split("-");

  if (moreValues) {
    const keyDay = newFormateDate[0] + newFormateDate[1] + newFormateDate[2];
    const newassistanceDate =
      newFormateDate[2] + "-" + newFormateDate[1] + "-" + newFormateDate[0];
    const dayName = getDayName(assistanceDate);
    const dayShort = dayName === "Miércoles" ? "X" : dayName.charAt(0);

    values["keyDay"] = keyDay;
    values["assistanceDate"] = newassistanceDate;
    values["dayName"] = dayName;
    values["dayShort"] = dayShort;

    return values;
  } else {
    return (
      newFormateDate[2] + "/" + newFormateDate[1] + "/" + newFormateDate[0]
    );
  }
}

function getDayName(assistanceDate) {
  const dayName = fnsFormat(assistanceDate, "dddd", {
    locale: fnsESLocale
  });
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
}
module.exports = internals;
