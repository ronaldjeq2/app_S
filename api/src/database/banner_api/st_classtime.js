/*
 * Custom Package st_classtimes
 */

const oracledb = require("oracledb"),
    internals = {};

/*
 * Function f_query_all
 * Returns SSRMEET_data
 * @param {NUMBER} p_pidm
 * @param {DATE}   start_date  Course Reference Number (CRN) of the course section. VARCHAR2(5)

 *
 * @return {}
 */

internals.f_query_all = (n_p_pidm, v_p_fecha) => [
    `
    SELECT * FROM TABLE(senati.GWZWAPP.f_horario_alum_tbl(:n_p_pidm,:v_p_fecha,nc_rango_dias =>60)) ORDER BY SSRMEET_BEGIN_TIME DESC
   `,
    {
        n_p_pidm: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            maxSize: 9,
            val: n_p_pidm
        },
        v_p_fecha: {
            dir: oracledb.BIND_IN,
            type: oracledb.STRING,
            maxSize: 10,
            val: v_p_fecha
        }
    },
    { outFormat: oracledb.OBJECT }
];

module.exports = internals;
