/* # Banner Business Entity and Business Process APIs - General
 * Package gb_third_party_access
 * 
 * This package provides the Common Business interface for Third Party Access.
 *
 */

const oracledb = require('oracledb'),
  internals = {};

/*
 * Function f_validate_pin
 * Verify the user and password matches and return
 * result Returns 1 when user and password are correct or 0 when dont
 * @param p_pidm
 * @param p_pin
 * 
 * @return {Boolean}
 * @return {String}   p_expire_ind  Returns a 'Y' if the PIN is expired, otherwise an 'N'. VARCHAR2(01)
 * @return {String}   p_disable_ind Returns a 'Y' if the PIN is disabled, otherwise an 'N'. VARCHAR2(01)
 */
internals.f_validate_pin = ( p_pidm, p_pin ) => [
  `
    BEGIN
      :result :=
        CASE WHEN
          baninst1.gb_third_party_access.f_validate_pin(
            :p_pidm,
            :p_pin,
            :p_expire_ind,
            :p_disable_ind
          )
          THEN 1
          ELSE 0
        END;
    END;
  `,
  {
    p_pidm      : {dir: oracledb.BIND_IN,  type: oracledb.NUMBER, maxSize: 8, val: p_pidm },
    p_pin       : {dir: oracledb.BIND_IN,  type: oracledb.STRING, maxSize: 200, val: p_pin },
    p_disable_ind : {dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1},
    p_expire_ind  : {dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1},
    result        : {dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 1 }
  }
];

module.exports = internals;