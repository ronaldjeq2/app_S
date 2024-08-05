export const COURSE_CURRENT_SUCCESS = "COURSE_CURRENT_SUCCESS";
export const COURSE_HISTORY_SUCCESS = "COURSE_HISTORY_SUCCESS";
export const COURSE_REQUEST = "COURSE_REQUEST";
export const COURSE_DETAIL_REQUEST = "COURSE_DETAIL_REQUEST";
export const COURSE_DETAIL_SUCCESS = "COURSE_DETAIL_SUCCESS";
export const COURSE_SCHEDULE_REQUEST = "COURSE_SCHEDULE_REQUEST";
export const COURSE_SCHEDULE_SUCCESS = "COURSE_SCHEDULE_SUCCESS";
export const ASSISTANCE_REQUEST = "ASSISTANCE_REQUEST";
export const ASSISTANCE_SUCCESS = "ASSISTANCE_SUCCESS";
export const courseCurrentSuccess = currentList => ( {
    type: COURSE_CURRENT_SUCCESS,
    currentList,
} );
export const courseRequest = typeList => ( {
    type: COURSE_REQUEST,
    typeList,
} );
export const courseHistorySuccess = historyList => ( {
    type: COURSE_HISTORY_SUCCESS,
    historyList,
} );

export const courseDetailRequest = ( periodo, nrc_curso, typeCourse ) => ( {
    type: COURSE_DETAIL_REQUEST,
    periodo,
    nrc_curso,
    typeCourse,
} );

export const courseDetailSucces = () => ( {
    type: COURSE_DETAIL_SUCCESS,
} );

export const courseScheduleRequest = codTerm => ( {
    type: COURSE_SCHEDULE_REQUEST,
    codTerm,
} );

export const courseScheduleSuccess = () => ( {
    type: COURSE_SCHEDULE_SUCCESS,
} );

export const assistanceRequest = ( periodo, nrc_curso ) => ( {
    type: ASSISTANCE_REQUEST,
    periodo,
    nrc_curso,
} );

export const assistanceSuccess = () => ( {
    type: ASSISTANCE_SUCCESS,
} );
