import {
    put, call, all, select,
} from "redux-saga/effects";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';

import {
    COURSE_CURRENT_SUCCESS,
    COURSE_HISTORY_SUCCESS,
    COURSE_DETAIL_SUCCESS,
    COURSE_SCHEDULE_SUCCESS,
    COURSE_SCHEDULE_REQUEST,
    ASSISTANCE_SUCCESS,
    ASSISTANCE_REQUEST,
} from "../../actions/course";
import "../../actions/session";
import API from "../api";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";

const getCurrentCourseList = () => API( {
    url: "/course",
    method: "POST",
    data: { inProgressFlag: "TRUE" },
} );

const getHistoryCourseList = () => API( {
    url: "/course",
    method: "POST",
    data: { inProgressFlag: "false" },
} );

const getCourseDetail = ( codTerm, nrc ) => API( {
    url: `/course/${ codTerm }/${ nrc }`,
    method: "GET",
} );

const CourseSchedule = codTerm => API( {
    url: `/course/${ codTerm }/schedule`,
    method: "GET",
} );

const AssitanceDetail = ( periodo, nrc ) => API( {
    url: `/course/${ periodo }/${ nrc }/assistance`,
    method: "GET",
} );

export function* handleCurrentRequestAction( action ) {
    firebase.crashlytics().log("saga => handleCurrentRequestAction")

    //Crashlytics.log( "saga => handleCurrentRequestAction" );
    const courseList = yield select( state => state.course.courseList );
    const existData = Object.keys( courseList[ action.typeList ] ).length > 0;
    try {
        const callService = action.typeList === "current" ? getCurrentCourseList : getHistoryCourseList;
        firebase.crashlytics().log( `api call ${
            action.typeList === "current" ? "getCurrentCourseList" : "getHistoryCourseList"
        } `)

        /*   Crashlytics.log(
            `api call ${
                action.typeList === "current" ? "getCurrentCourseList" : "getHistoryCourseList"
            } `,
        ); */

        const response = yield call( callService );

        if ( response.status === 200 ) {
            yield put( { type: NO_ERROR } );
            const lastUpdated = response.headers.date;

            if ( action.typeList === "current" ) {
                const currentList = response.data;
                courseList.current = currentList;
                yield put( { type: COURSE_CURRENT_SUCCESS, courseList, lastUpdated } );

                const requestAllCurrentSchedules = [];
                for ( let i = 0; i < currentList.length; i += 1 ) {
                    const codTerm = currentList[ i ].periodo;
                    requestAllCurrentSchedules.push(
                        put( { type: COURSE_SCHEDULE_REQUEST, codTerm } ),
                    );
                }
                yield all( requestAllCurrentSchedules );
                firebase.crashlytics().log(`API call => ${
                                        action.typeList === "current"
                                            ? "getCurrentCourseList"
                                            : "getHistoryCourseList"
                                    } => 200 Ok`)

/*                 Crashlytics.log(
                    `API call => ${
                        action.typeList === "current"
                            ? "getCurrentCourseList"
                            : "getHistoryCourseList"
                    } => 200 Ok`,
                ); */
            }
            else {
                const historyList = response.data;
                courseList.historical = historyList;
                yield put( { type: COURSE_HISTORY_SUCCESS, courseList, lastUpdated } );
            }
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: existData,
                errorStatus: 0,
            } );
        }
    }
    catch ( error ) {
        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: existData,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: existData,
            } );
        }
    }
}

export function* handleDetailRequestAction( action ) {
    firebase.crashlytics().log("saga => handleDetailRequestAction")

  //  Crashlytics.log( "saga => handleDetailRequestAction" );
    const { periodo, nrc_curso, typeCourse } = action;
    const detail = yield select( state => state.course.detail );
    let lastUpdated = yield select( state => state.course.lastUpdated );

    const existData = detail[ periodo ] !== undefined
        && detail[ periodo ][ nrc_curso ] !== undefined
        && detail[ periodo ][ nrc_curso ].nrcDetail !== undefined;
    try {
        firebase.crashlytics().log("API call => getCourseDetail ")

       // Crashlytics.log( "API call => getCourseDetail " );
        const response = yield call( getCourseDetail, action.periodo, action.nrc_curso );
        if ( response.status === 200 ) {
            lastUpdated = response.headers.date;
            detail[ periodo ] = detail[ periodo ] || {};
            detail[ periodo ][ nrc_curso ] = detail[ periodo ][ nrc_curso ] || {};
            detail[ periodo ][ nrc_curso ].nrcDetail = response.data;
            yield put( { type: NO_ERROR } );
            yield put( { type: COURSE_DETAIL_SUCCESS, detail, lastUpdated } );
            yield put( {
                type: ASSISTANCE_REQUEST,
                periodo,
                nrc_curso,
            } );
            firebase.crashlytics().log("API call => getCourseDetail => 200 Ok")

          //  Crashlytics.log( "API call => getCourseDetail => 200 Ok" );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: existData,
                errorStatus: 0,
            } );
        }
    }
    catch ( error ) {
        yield put( { type: COURSE_DETAIL_SUCCESS, detail, lastUpdated } );
        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: existData,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: existData,
            } );
        }
    }
}

export function* handleCourseScheduleRequestAction( action ) {
    firebase.crashlytics().log("Saga => handleCourseScheduleRequestAction")

 //   Crashlytics.log( "Saga => handleCourseScheduleRequestAction" );
    try {
        firebase.crashlytics().log("API call => CourseSchedule")

     //   Crashlytics.log( "API call => CourseSchedule" );
        const response = yield call( CourseSchedule, action.codTerm );
        if ( response.status === 200 ) {
            const scheduleListByNRC = response.data;
            const lastUpdated = response.headers.date;

            yield put( { type: NO_ERROR } );

            yield put( { type: COURSE_SCHEDULE_SUCCESS, scheduleListByNRC, lastUpdated } );
            firebase.crashlytics().log("API call => CourseSchedule => 200 Ok")

            //Crashlytics.log( "API call => CourseSchedule => 200 Ok" );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: false,
                errorStatus: 0,
            } );
        }
    }
    catch ( error ) {
        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: false,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: false,
            } );
        }
    }
}

export function* handleAssistanceRequestAction( action ) {
    firebase.crashlytics().log("Saga => handleAssitanceRequestAction")

   // Crashlytics.log( "Saga => handleAssitanceRequestAction" );
    let assitanceCourse = yield select( state => state.course.assitanceCourse );
    const existInfo = Object.keys( assitanceCourse ) > 0;
    try {
        firebase.crashlytics().log("API call => CourseSchedule")

       // Crashlytics.log( "API call => CourseSchedule" );
        const response = yield call( AssitanceDetail, action.periodo, action.nrc_curso );
        if ( response.status === 200 ) {
            assitanceCourse = response.data;
            const lastUpdated = response.headers.date;

            yield put( { type: NO_ERROR } );
            yield put( { type: ASSISTANCE_SUCCESS, assitanceCourse, lastUpdated } );
            firebase.crashlytics().log("API call => CourseSchedule => 200 Ok" )

           // Crashlytics.log( "API call => CourseSchedule => 200 Ok" );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: existInfo,
                errorStatus: 0,
            } );
        }
    }
    catch ( error ) {
        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: existInfo,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: existInfo,
            } );
        }
    }
}
