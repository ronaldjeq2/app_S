/*
 * Custom Package st_classtimes
 */

const oracledb = require("oracledb"),
  internals = {};

/*
 * Function get_identification
 * Returns SSRMEET_data
 * @param {NUMBER} p_pidm   Identification number used to access the person on-line
 *
 * @return {object}
 */

internals.get_identification = p_pidm => [
  `
  SELECT
    SPRIDEN.SPRIDEN_PIDM as PIDM,
    SPRIDEN.SPRIDEN_ID as ID,
    SPRIDEN.SPRIDEN_LAST_NAME  AS LAST_NAME,
    SPRIDEN.SPRIDEN_FIRST_NAME AS FIRST_NAME,
    SPRIDEN.SPRIDEN_MI         AS MIDDLE_NAME,
    SPBPERS.SPBPERS_SSN        AS NUMDOC,
    SPBPERS.SPBPERS_BIRTH_DATE AS BIRTH_DATE,
    TO_CHAR(SPBPERS.SPBPERS_BIRTH_DATE,'DD/MM/YYYY') AS BIRTH_DATE_STRING
    -- SPRIDEN.SPRIDEN_CHANGE_IND,
    -- SPRIDEN.SPRIDEN_NTYP_CODE,
    -- SPRIDEN.SPRIDEN_SURNAME_PREFIX
  FROM
    SATURN.SPRIDEN
  JOIN
    SATURN.SPBPERS
      ON SPBPERS.SPBPERS_PIDM = SPRIDEN.SPRIDEN_PIDM
  WHERE
    SPRIDEN.SPRIDEN_PIDM = :p_pidm AND
    SPRIDEN.SPRIDEN_CHANGE_IND IS NULL
`,
  {
    p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      maxSize: 8,
      val: p_pidm
    }
  },
  { outFormat: oracledb.OBJECT }
];

/*
 * Function list_address
 * Returns SSRMEET_data
 * @param {NUMBER} p_pidm   Identification number used to access the person on-line
 *
 * @return {object}
 */
internals.list_address = p_pidm => [
  `
  SELECT
    -- SPRADDR.0,
    -- SPRADDR.SPRADDR_ATYP_CODE,
    -- SPRADDR.SPRADDR_SEQNO,
    -- SPRADDR.SPRADDR_FROM_DATE,
    -- SPRADDR.SPRADDR_TO_DATE,
    SPRADDR.SPRADDR_STREET_LINE1 || ' ' ||
    SPRADDR.SPRADDR_STREET_LINE2 || ' ' ||
    SPRADDR.SPRADDR_STREET_LINE3 AS STREET_ADDRESS,
    SPRADDR.SPRADDR_CITY         AS CITY,
    SPRADDR.SPRADDR_STAT_CODE    AS STAT_CODE,
    SPRADDR.SPRADDR_ZIP          AS ZIP_CODE,
    SPRADDR.SPRADDR_CNTY_CODE    AS CONTRY_CODE,
    SPRADDR.SPRADDR_NATN_CODE    AS NATN_CODE,
    SPRADDR.SPRADDR_PHONE_NUMBER    AS PHONE_NUMBER,
    STVATYP.STVATYP_DESC  AS TYPE
    --SPRADDR.SPRADDR_STATUS_IND,
    -- SPRADDR.SPRADDR_USER,
    -- SPRADDR.SPRADDR_ASRC_CODE,
    -- SPRADDR.SPRADDR_DELIVERY_POINT,
    -- SPRADDR.SPRADDR_CORRECTION_DIGIT,
    -- SPRADDR.SPRADDR_CARRIER_ROUTE,
    -- SPRADDR.SPRADDR_GST_TAX_ID,
    -- SPRADDR.SPRADDR_REVIEWED_IND,
    -- SPRADDR.SPRADDR_REVIEWED_USER,
    -- SPRADDR.SPRADDR_DATA_ORIGIN,
    -- SPRADDR.SPRADDR_CTRY_CODE_PHONE,
    -- SPRADDR.SPRADDR_HOUSE_NUMBER,
    -- SPRADDR.SPRADDR_STREET_LINE4
  FROM
    SATURN.SPRADDR
  LEFT JOIN
    SATURN.STVATYP
      ON STVATYP.STVATYP_CODE = SPRADDR.SPRADDR_ATYP_CODE
  WHERE
    SPRADDR.SPRADDR_PIDM = :p_pidm and (  SPRADDR.SPRADDR_STATUS_IND <>'I' or SPRADDR.SPRADDR_STATUS_IND is null)
`,
  {
    p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      maxSize: 8,
      val: p_pidm
    }
  },
  { outFormat: oracledb.OBJECT }
];

internals.phone_list = p_pidm => [
  `
  SELECT
  SPRTELE.SPRTELE_PHONE_NUMBER AS PHONE_NUMBER,
  SPRTELE.SPRTELE_PHONE_AREA AS PHONE_AREA,
  STVATYP.STVATYP_DESC  AS TYPE
FROM
  SATURN.SPRTELE
LEFT JOIN
  SATURN.STVATYP
    ON STVATYP.STVATYP_CODE = SPRTELE.SPRTELE_ATYP_CODE
WHERE
SPRTELE.SPRTELE_PIDM = :p_pidm and (  SPRTELE.SPRTELE_STATUS_IND <>'I' or SPRTELE.SPRTELE_STATUS_IND is null)
  `,
  {
    p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      maxSize: 8,
      val: p_pidm
    }
  },
  { outFormat: oracledb.OBJECT }
];

/*
 * Function list_email
 * Returns SSRMEET_data
 * @param {NUMBER} p_pidm   Identification number used to access the person on-line
 * @return {object}
 */
internals.list_email = p_pidm => [
  `
  SELECT
    -- GOREMAL.GOREMAL_PIDM,
    -- GOREMAL.ROWID as ROWID,
    GOREMAL.GOREMAL_EMAL_CODE     AS EMAL_CODE,
    GOREMAL.GOREMAL_EMAIL_ADDRESS AS EMAIL_ADDRESS,
    GOREMAL.GOREMAL_STATUS_IND    AS STATUS_IND,
    GOREMAL.GOREMAL_PREFERRED_IND AS PREFERRED_IND
    -- GOREMAL.GOREMAL_USER_ID,
    -- GOREMAL.GOREMAL_COMMENT,
    -- GOREMAL.GOREMAL_DISP_WEB_IND,
    -- GOREMAL.GOREMAL_DATA_ORIGIN
  FROM
    GENERAL.GOREMAL
  WHERE
   GOREMAL.GOREMAL_PIDM = :p_pidm and GOREMAL.GOREMAL_STATUS_IND='A'
`,
  {
    p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      maxSize: 8,
      val: p_pidm
    }
  },
  { outFormat: oracledb.OBJECT }
];

internals.period_list = p_pidm => [
  `
    select * from table(senati.gwzwapp.f_periodos_by_id_tbl(:v_p_id))
    `,
  {
    v_p_id: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      maxSize: 9,
      val: p_pidm
    }
  },
  { outFormat: oracledb.OBJECT }
];

internals.career_detail = (period, p_pidm) => [
  `
    select * from table (senati.gwzwapp.f_datos_acad_alum_tbl (:n_p_pidm, :v_p_term  ))
      `,

  {
    v_p_term: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      maxSize: 6,
      val: period
    },
    n_p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      maxSize: 9,
      val: p_pidm
    }
  },
  { outFormat: oracledb.OBJECT }
];

internals.worker_detail = p_pidm => [
  `
         select * from table(senati.gwzwapp.f_datos_fotocheck_empl_tbl (:n_p_pidm))
        `,

  {
    n_p_pidm: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      maxSize: 9,
      val: p_pidm
    }
  },
  { outFormat: oracledb.OBJECT }
];

module.exports = internals;
