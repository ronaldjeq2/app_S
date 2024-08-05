/* # Banner Business Entity and Business Process APIs - General
 * Package db_test
 * Provitional function to test db
 *
 */

const oracledb = require('oracledb'),
  internals = {};

/*
 * Function f_get_spriden
 */
internals.f_get_spriden = ( p_pid ) => [
  `
    SELECT 
      SPRIDEN.SPRIDEN_PIDM,
      SPRIDEN.SPRIDEN_ID,
      SPRIDEN.SPRIDEN_LAST_NAME,
      SPRIDEN.SPRIDEN_FIRST_NAME,
      SPRIDEN.SPRIDEN_MI
    FROM SATURN.SPRIDEN SPRIDEN
    WHERE 
      SPRIDEN.SPRIDEN_PIDM = :p_pid
  `,
    [p_pid]
    // ,
    // { outFormat: oracledb.OBJECT }
];

internals.dbms_output = () => [
  "BEGIN DBMS_OUTPUT.GET_LINE(:ln, :st); END;",
  { 
    ln: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
    st: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } 
  }
]
module.exports = internals;
