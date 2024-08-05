/* # Banner Business Entity and Business Process APIs - General
 * Package gb_third_party_access
 *
 * This package provides the Common Business interface for Third Party Access.
 *
 */

const oracledb = require("oracledb"),
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
internals.get_assistance_summary = (p_pidm, p_periodo, p_nrc) => [
  `select * from table(SENATI.gwzwapp.f_asiste_id_term_crn_grp_tbl (:n_p_pidm, :v_p_term, :v_p_crn))`,
  {
    n_p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      maxSize: 8,
      val: p_pidm
    },
    v_p_term: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      maxSize: 6,
      val: p_periodo
    },
    v_p_crn: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      maxSize: 5,
      val: p_nrc
    }
  },
  { outFormat: oracledb.OBJECT }
];
internals.get_assistance_detail = (p_pidm, p_periodo, p_nrc) => [
  `select * from table(SENATI.gwzwapp.f_asiste_id_term_crn_deta_tbl (:n_p_pidm, :v_p_term, :v_p_crn))`,
  {
    n_p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      maxSize: 8,
      val: p_pidm
    },
    v_p_term: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      maxSize: 6,
      val: p_periodo
    },
    v_p_crn: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      maxSize: 5,
      val: p_nrc
    }
  },
  { outFormat: oracledb.OBJECT }
];
module.exports = internals;
