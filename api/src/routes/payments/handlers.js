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

let internals = {};

internals.getListPeriods = function (request, h) {
    const credentials = request.auth.credentials;

    const idAlumno = credentials.pid;
    const term = {};
    try {


        const response = request.app.db
            .execute(
                ...[
                    `
        select * from table(senati.gwzwapp.f_periodos_by_id_tbl(:v_p_id))
        `,
                    {
                        v_p_id: {
                            dir: oracledb.BIND_IN,
                            type: oracledb.STRING,
                            maxSize: 9,
                            val: idAlumno
                        }
                    },
                    { outFormat: oracledb.OBJECT }
                ]
            )
            .then(data => {
                data.rows.map(component => {
                    const period = component["PERIODO"];
                    term[period] = {};
                    const statePeriod =
                        component["DEUDA"] === 0 ? "Al día" : "Pendiente de Pago";

                    (term[period].debt = component["DEUDA"]),
                        (term[period].codPayment = component["CODIGO_PAGO"]);
                    term[period]["state"] = component["DEUDA"] === null ? statePeriod : '';
                    // term[periodo].push({
                    //   period: component["PERIODO"],
                    //   debt: component["DEUDA"],
                    //   codPayment: component["CODIGO_PAGO"]
                    // });
                });

                return term;
            })
            .catch(error => {
                console.log(`idAlumno: ${credentials.pid}`);
                console.log("Params", request.params);
                console.log(error);
                return (
                    Boom.badImplementation(
                        `Error desconocido en getListPeriods on ID ${credentials.pid}`,
                        credentials.pid
                    )
                );
            });
        return response;
    }
    catch (e) {
        console.log(e);
        return e
    }
};

function updateNumberFormat(number) {
    const [paymentInt, paymentDecimal] = number.split(".");
    return parseInt(paymentInt).toLocaleString() + "." + paymentDecimal;
}

internals.getPeriodDetail = function (request, h) {
    const credentials = request.auth.credentials;

    const idAlumno = credentials.pidm;
    try {


        let { period } = request.params;
        if (period === "null" || period === undefined || period === null) {
            period = null;
        }

        const response = request.app.db
            .execute(
                ...[
                    `
             select * from table(senati.gwzwapp.f_crono_by_id_term_tbl (:n_p_pidm,:v_p_term)) 
         `,
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
                            val: period
                        }
                    },
                    { outFormat: oracledb.OBJECT }
                ]
            )
            .then(data => {
                const period = {};
                const termDetail = [];
                let Totalbalance = 0;
                let totalDebt = 0;
                let futureDebt = 0;
                let mountCanceled = 0;
                let lastExpiration;
                let futureExpiration = "30001231";
                let concatenatedDebtObservations = null;
                let concatenatedFuruteDebtObservations = null;
                let contDebt = 0;
                let contFutureDebt = 0;

                data.rows.map((component, key) => {
                    Totalbalance = Totalbalance + component["BALANCE"]; // Calculate period´s total balance
                    mountCanceled =
                        mountCanceled + component["MONTO"] - component["BALANCE"]; //calculate mount Canceled

                    //Added paremeters for terns details
                    termDetail.push({
                        keyPayment: aguid(),
                        tittle: component["CONCEPTO"],
                        mount: updateNumberFormat(component["MONTO"].toFixed(2)),
                        balance: updateNumberFormat(component["BALANCE"].toFixed(2)),
                        dueDate: component["FECHA_VENCIMIENTO"],
                        state: component["OBSERVACIONES"],
                        debt: component["DEBE"] === "Y"
                    });

                    // Calculate current period if has debt
                    if (component["DEBE"] === "Y") {
                        contDebt = contDebt + 1;

                        if (totalDebt === 0) {
                            // if exist one debt added description
                            concatenatedDebtObservations = component["CONCEPTO"];
                        } else {
                            //if exist more debts, added new description
                            concatenatedDebtObservations = null;
                            concatenatedDebtObservations = `Monto total de las ${contDebt} últimas cuotas vencidas `;
                        }
                        //added totalDebts and lastExpiration for Period
                        totalDebt = totalDebt + component["BALANCE"];
                        lastExpiration = component["FECHA_VENCIMIENTO"];
                    }

                    // Calculate current period if doesn't has debt but has future debt
                    if (component["DEBE"] !== "Y" && component["BALANCE"] > 0) {
                        // transforming expiration format to 'YYYYMMDD'
                        const expirationDate = component["FECHA_VENCIMIENTO"].split("/");
                        const expirationDateFormat =
                            expirationDate[2] + expirationDate[1] + expirationDate[0];

                        if (futureExpiration === expirationDateFormat) {
                            //if exist more futuredebts whit same expiration date, added new description
                            contFutureDebt = contFutureDebt + 1;
                            futureDebt = futureDebt + component["BALANCE"];
                            concatenatedDebtObservations = `Monto total de las ${contFutureDebt} cuotas próximas a vencer `;
                        } else {
                            if (futureExpiration > expirationDateFormat) {
                                //Finding the nearest expiration date and update List
                                contFutureDebt = 0;
                                contFutureDebt = contFutureDebt + 1;
                                futureExpiration = component["FECHA_VENCIMIENTO"];
                                concatenatedFuruteDebtObservations = null;
                                futureDebt = component["BALANCE"];
                                concatenatedFuruteDebtObservations = component["CONCEPTO"];
                            }
                        }
                    }
                });

                //Updated period's list of detail  with mount canceled and mount total with format 00.00;
                period["mountCanceled"] = updateNumberFormat(mountCanceled.toFixed(2));
                period["mountTotal"] = updateNumberFormat(
                    (mountCanceled + Totalbalance).toFixed(2)
                );

                // Added currentPayment into Period detail
                if (Totalbalance === 0) {
                    //When  didn't has debts
                    period["currentPayment"] = {};
                    period["currentPayment"]["dueDate"] = " ";
                    period["currentPayment"]["mount"] = updateNumberFormat(
                        Totalbalance.toFixed(2)
                    );
                    period["currentPayment"]["tittle"] =
                        "Todas tus cuotas estan canceladas";
                    period["currentPayment"]["debt"] = false;
                } else {
                    if (totalDebt > 0) {
                        //When  exist debts
                        period["currentPayment"] = {};
                        period["currentPayment"]["dueDate"] = lastExpiration;
                        period["currentPayment"]["mount"] = updateNumberFormat(
                            totalDebt.toFixed(2)
                        );
                        period["currentPayment"]["tittle"] = concatenatedDebtObservations;
                        period["currentPayment"]["debt"] = true;
                    } else if (totalDebt === 0) {
                        // When didn't exist debts but exist futuredebts
                        period["currentPayment"] = {};
                        period["currentPayment"]["dueDate"] = futureExpiration;
                        period["currentPayment"]["mount"] = updateNumberFormat(
                            futureDebt.toFixed(2)
                        );
                        period["currentPayment"][
                            "tittle"
                        ] = concatenatedFuruteDebtObservations;
                        period["currentPayment"]["debt"] = false;
                    }
                }
                //added list payments into period detail
                period["termDetail"] = termDetail;

                return period;
            })
            .catch(error => {
                console.log(`idAlumno: ${credentials.pid}`);
                console.log("Params", request.params);
                console.log(error);
                return (
                    Boom.badImplementation(
                        `Error desconocido en getCourseDetail on ID ${credentials.pid}`,
                        credentials.pid
                    )
                );
            });
        return response;
    }
    catch (e) {
        console.log(e);
        return e
    }
};
module.exports = internals;
