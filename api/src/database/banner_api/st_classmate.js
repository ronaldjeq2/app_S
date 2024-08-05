/*
 * Custom Package st_classmates
 */

const oracledb = require("oracledb"),
    internals = {};

/*
 * Function get_list of classmates by a given pidm and ref_date
 * search for all classtimes by the ref_date and extracts his courses (nrc and term_code)
 * after that search all students with the same classtimes
 *
 * Returns Array of Number
 * @param {NUMBER} p_pidm
 *
 * @return [PIDM Number]
 */

internals.get_list = p_pidm => [
    `
  SELECT
    DISTINCT CLASSMATE.SFRSTCR_PIDM AS CLASSMATE_PIDM
  FROM
    SATURN.SFRSTCR CLASSMATE
  JOIN
    SATURN.SFRSTCR STUDENT
      ON
        STUDENT.SFRSTCR_CRN       = CLASSMATE.SFRSTCR_CRN AND
        STUDENT.SFRSTCR_TERM_CODE = CLASSMATE.SFRSTCR_TERM_CODE
  WHERE
    STUDENT.SFRSTCR_PIDM = :p_pidm
`,
    {
        p_pidm: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            maxSize: 8,
            val: p_pidm
        }
    }
    // ,
    //  { outFormat: oracledb.OBJECT }
];

/*****
 * GET classmates by ref_date throught schedule
 * and then get they upcoming birthays in the next 45 days
 */
internals.get_upcoming_birthdays = (p_pidm, ref_date) => [
    `
    SELECT
    SPRIDEN.SPRIDEN_PIDM        AS STUDENT_ID,
    SPRIDEN.SPRIDEN_LAST_NAME  AS LAST_NAME,
    SPRIDEN.SPRIDEN_FIRST_NAME AS FIRST_NAME,
    SPRIDEN.SPRIDEN_MI         AS MIDDLE_NAME,
  
    TO_DATE(
    add_months(SPBPERS.SPBPERS_BIRTH_DATE, 12 * (extract(year from :ref_date) - extract(year from SPBPERS.SPBPERS_BIRTH_DATE)))
    ) AS BIRTH_DATE,
  
    TO_CHAR( add_months(SPBPERS.SPBPERS_BIRTH_DATE, 12 * (extract(year from :ref_date) - extract(year from SPBPERS.SPBPERS_BIRTH_DATE))), 'DD/MM/') || EXTRACT( YEAR FROM :ref_date) AS BIRTH_DATE_STRING
  FROM
    SATURN.SPRIDEN
  JOIN
    SATURN.SPBPERS
      ON SPBPERS.SPBPERS_PIDM = SPRIDEN.SPRIDEN_PIDM
  WHERE
    add_months(SPBPERS.SPBPERS_BIRTH_DATE, 12 * (extract(year from :ref_date) - extract(year from SPBPERS.SPBPERS_BIRTH_DATE)))
  
     BETWEEN (:ref_date) AND (:ref_date + 190)
    AND
    /*** GET CLASSMATES BY COURSE AND DATE ****/
    SPRIDEN.SPRIDEN_PIDM IN (
      SELECT
        DISTINCT CLASSMATE.SFRSTCR_PIDM AS CLASSMATE_PIDM
      FROM SATURN.SSRMEET
  
      JOIN SATURN.SFRSTCR CLASSMATE
        ON SSRMEET.SSRMEET_TERM_CODE = CLASSMATE.SFRSTCR_TERM_CODE AND
           SSRMEET.SSRMEET_CRN       = CLASSMATE.SFRSTCR_CRN
  
      JOIN SATURN.SFRSTCR STUDENT
        ON STUDENT.SFRSTCR_CRN       = CLASSMATE.SFRSTCR_CRN AND
           STUDENT.SFRSTCR_TERM_CODE = CLASSMATE.SFRSTCR_TERM_CODE
      WHERE
           STUDENT.SFRSTCR_PIDM = :p_pidm
           AND :ref_date BETWEEN SSRMEET.SSRMEET_START_DATE AND SSRMEET.SSRMEET_END_DATE
    ) 
    AND SPRIDEN.SPRIDEN_CHANGE_IND IS NULL
    ORDER BY BIRTH_DATE ASC   
`,
    {
        p_pidm: {
            dir: oracledb.BIND_IN,
            type: oracledb.NUMBER,
            maxSize: 8,
            val: p_pidm
        },
        ref_date: {
            dir: oracledb.BIND_IN,
            type: oracledb.DATE,
            maxSize: 8,
            val: ref_date
        }
    },
    { outFormat: oracledb.OBJECT }
];

module.exports = internals;
