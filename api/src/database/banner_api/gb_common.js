/* # Banner Business Entity and Business Process APIs - General
 * Package gb_common
 * This package provides utility functions and procedures for the Banner APIs.
 *
 * Some of these includes functions for formatting error messages, generating PIDMs, IDs, 
 * address sequence numbers, telephone sequence numbers, and the p_commit and p_rollback 
 * procedures that are used to end transactions and appropriately publish or discard messages.
 *
 *
 */

const oracledb = require('oracledb'),
  internals = {};

/*
 * Function f_get_pidm
 * Returns the PIDM corresponding to the SPRIDEN record with the given ID.
 * @param {STRING} p_pid Identification number used to access the person on-line. VARCHAR2(9) Required Key
 * 
 * @return {NUMBER} The PIDM corresponding to the SPRIDEN record with the given ID.
 */
internals.f_get_pidm = ( p_pid ) => [
  `
    BEGIN
      :result := baninst1.gb_common.f_get_pidm( :p_pid );
    END;
  `,
  {
    p_pid      : {dir: oracledb.BIND_IN,  type: oracledb.STRING, maxSize: 9, val: p_pid },
    result     : {dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 8 }
  }
];

internals.f_id_exists = ( p_pid ) => [
  `
    BEGIN
      :result := 
        CASE baninst1.gb_common.f_id_exists( :p_pid )
          WHEN 'Y' THEN 1
          ELSE 0
        END;
    END;
  `,
  {
    p_pid      : {dir: oracledb.BIND_IN,  type: oracledb.STRING, maxSize: 9, val: p_pid },
    result     : {dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 1 }
  }
];

module.exports = internals;
