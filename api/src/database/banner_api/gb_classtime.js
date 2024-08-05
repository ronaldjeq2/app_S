/* # Banner Business Entity and Business Process APIs - General
 * Package gb_classtimes
 * This package provides the Common Business interface for the meeting times API (gb_classtimes).
 *
 * Meeting times can be added for valid course sections in the Schedule module as well as events and functions associated with events on the Events Management module.
 * 
 * The mandatory values for meeting times records are different depending on whether meeting times records are being created or updated to support course sections or events and functions.
 * For course sections, term, CRN, start date and end date, schedule type, number of hours per week session meets, session credit hours and session indicator must be supplied. The term for a course section must be valid in the Term Validation table (STVTERM). The CRN must be valid for a course section for the term specified.  The start date must be equal to or less than the end date.
 * 
 * For events and functions, term, CRN, start and end date, and begin and end time must be supplied.
 * Term must be the literal value 'EVENT' for meeting times associated with events and functions.
 * The CRN must be valid for an existing event (SLBEVNT). The start date must be less than or equal to the end date. The end time must be greater than the start time.
 * 
 * Multiple meeting times may exist for a course section as well as for an event or function. Meeting times may specify additional optional information including days of the week, start and end times, and building and room codes. Valid days of the week are for any day(s) that exist between the specified start and end date for the meeting times (M - Monday, T - Tuesday, W - Wednesday, R - Thursday, F - Friday, S - Saturday, U - Sunday). A start time and end time for a course section, event or function must be entered in military format with values between 0000 and 2359. Both start and end time must be provided.
 * 
 * A building code can be provided without a room code. When both a building and room code are provided, only rooms defined with Room Type - 'C' (Course) may be used to schedule course sections. Rooms defined with Room Type - 'D' (Dorm) or 'O' (Other) may be used to schedule events and functions.
 * 
 * Dates, times and other values must be valid and exist without time and room conflicts (unless overridden).
 * Overrides for meeting times conflicts are administratively authorized. Conflict override indicators for course sections overrides may be either 'T' (Time conflict), 'R' (Room conflict), or 'O' (Other conflicts).
 * Event overrides is restricted to 'O'.
 * 
 * A meeting times record for a traditional course section can be deleted if no faculty assignment exists for the meeting time. A meeting times record for an open learning course section can be deleted even if a faculty assignment exists for the meeting time.
 *
 * @see more on http://remotescripts.ecu.edu/remotescripts/banner/api_erd_index_guide/api/general/gb_classtimes.html
 */

const oracledb = require('oracledb'),
  internals = {};

/*
 * Function f_query_all
 * Returns classtimes_ref
 * @param {STRING} p_term_code  Term for the meeting times for the course section (for event/functions provide 'EVENT'). VARCHAR2(6) Required
 * @param {STRING} p_crn        Course Reference Number (CRN) of the course section. VARCHAR2(5)
 * @param {STRING} p_begin_time Begin Time of the course section in HHMM format using 24-hour time. VARCHAR2(4)
 * ...
 * 
 * @return {CURSOR} 
 */
internals.f_query_all = ( p_term_code, p_crn ) => [
  `
  DECLARE
    classtimes_cur      BANINST1.gb_classtimes.classtimes_ref;
    classtimes_var      classtimes_cur%ROWTYPE;
    
  BEGIN
    classtimes_cur:=BANINST1.GB_CLASSTIMES.F_QUERY_ALL(:p_term_code, :p_crn);
    
    LOOP 
        FETCH classtimes_cur INTO classtimes_var;
        EXIT WHEN classtimes_cur%NOTFOUND;
        
        DBMS_OUTPUT.PUT_LINE(
          '{' || 
          '"' || 'r_term_code'      || '"' || ':' || '"' || classtimes_var.r_term_code       || '"' || ',' || 
          '"' || 'r_crn'            || '"' || ':' || '"' || classtimes_var.r_crn             || '"' || ',' || 
          '"' || 'r_begin_time'     || '"' || ':' || '"' || classtimes_var.r_begin_time      || '"' || ',' || 
          '"' || 'r_end_time'       || '"' || ':' || '"' || classtimes_var.r_end_time        || '"' || ',' || 
          '"' || 'r_bldg_code'      || '"' || ':' || '"' || classtimes_var.r_bldg_code       || '"' || ',' || 
          '"' || 'r_room_code'      || '"' || ':' || '"' || classtimes_var.r_room_code       || '"' || ',' || 
          '"' || 'r_start_date'     || '"' || ':' || '"' || classtimes_var.r_start_date      || '"' || ',' || 
          '"' || 'r_end_date'       || '"' || ':' || '"' || classtimes_var.r_end_date        || '"' || ',' || 
          '"' || 'r_catagory'       || '"' || ':' || '"' || classtimes_var.r_catagory        || '"' || ',' || 
          '"' || 'r_sun_day'        || '"' || ':' || '"' || classtimes_var.r_sun_day         || '"' || ',' || 
          '"' || 'r_mon_day'        || '"' || ':' || '"' || classtimes_var.r_mon_day         || '"' || ',' || 
          '"' || 'r_tue_day'        || '"' || ':' || '"' || classtimes_var.r_tue_day         || '"' || ',' || 
          '"' || 'r_wed_day'        || '"' || ':' || '"' || classtimes_var.r_wed_day         || '"' || ',' || 
          '"' || 'r_thu_day'        || '"' || ':' || '"' || classtimes_var.r_thu_day         || '"' || ',' || 
          '"' || 'r_fri_day'        || '"' || ':' || '"' || classtimes_var.r_fri_day         || '"' || ',' || 
          '"' || 'r_sat_day'        || '"' || ':' || '"' || classtimes_var.r_sat_day         || '"' || ',' || 
          '"' || 'r_schd_code'      || '"' || ':' || '"' || classtimes_var.r_schd_code       || '"' || ',' || 
          '"' || 'r_over_ride'      || '"' || ':' || '"' || classtimes_var.r_over_ride       || '"' || ',' || 
          '"' || 'r_credit_hr_sess' || '"' || ':' || '"' || classtimes_var.r_credit_hr_sess  || '"' || ',' || 
          '"' || 'r_meet_no'        || '"' || ':' || '"' || classtimes_var.r_meet_no         || '"' || ',' || 
          '"' || 'r_hrs_week'       || '"' || ':' || '"' || classtimes_var.r_hrs_week        || '"' || ',' || 
          '"' || 'r_func_code'      || '"' || ':' || '"' || classtimes_var.r_func_code       || '"' || ',' || 
          '"' || 'r_comt_code'      || '"' || ':' || '"' || classtimes_var.r_comt_code       || '"' || ',' || 
          '"' || 'r_schs_code'      || '"' || ':' || '"' || classtimes_var.r_schs_code       || '"' || ',' || 
          '"' || 'r_mtyp_code'      || '"' || ':' || '"' || classtimes_var.r_mtyp_code       || '"' || ',' || 
          '"' || 'r_data_origin'    || '"' || ':' || '"' || classtimes_var.r_data_origin     || '"' || ',' || 
          '"' || 'r_user_id'        || '"' || ':' || '"' || classtimes_var.r_user_id         || '"'
              || '}'
        );
    END LOOP;

  END;
  `,
  {
    p_term_code: {dir: oracledb.BIND_IN,  type: oracledb.STRING, maxSize: 6, val: p_term_code },
    p_crn      : {dir: oracledb.BIND_IN,  type: oracledb.STRING, maxSize: 5, val: p_crn }
  }
];

module.exports = internals;


/**

 DECLARE
      :v_rc sys_refcursor;
    BEGIN
      SELECT baninst1.gb_classtimes.f_query_all(:p_term_code, :p_crn) INTO :v_rc FROM DUAL;
    END;

DECLARE
      classtimes_cur      BANINST1.gb_classtimes.classtimes_ref;
      classtimes_var      classtimes_cur%ROWTYPE;
    BEGIN
      classtimes_cur := baninst1.gb_classtimes.f_query_all( :p_term_code, :p_crn );
      
      LOOP 
        FETCH classtimes_cur INTO classtimes_var;
        EXIT WHEN classtimes_cur%NOTFOUND;
        
        DBMS_OUTPUT.PUT_LINE( classtimes_var.r_term_code );
        
      END LOOP;
    END;

**/