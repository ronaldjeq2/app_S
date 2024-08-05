import { put, call, select } from "redux-saga/effects";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import { CLASSTIMES_SUCCESS } from "../../actions/classtimes";
import "../../actions/session";
import API from "../api";
// import messages from "../../config/messages";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";

export const ClasstimesScreenservice = ( token, actualdate ) => API( {
    url: "/student/classtimes",
    method: "POST",
    headers: { Authorization: `Bearer ${ token }` },
    data: {
        start_date: actualdate,
    },
} );

export function* handleClasstimesRequestAction( action ) {
    const TOKEN = yield select( state => state.session.token );
    let existListClass = false;
    firebase.crashlytics().log( "Iniciando la funcion handleClasstimesRequestAction ")

    //Crashlytics.log( "Iniciando la funcion handleClasstimesRequestAction " );

    try {
        firebase.crashlytics().log( "Iniciando  el llamado a ClasstimesScreenservice  ")

      //  Crashlytics.log( "Iniciando  el llamado a ClasstimesScreenservice  " );
        const response = yield call( ClasstimesScreenservice, TOKEN, action.actualDate );
        if ( response.status === 200 ) {
            const classTimesList = response.data;
            const lastUpdated = response.headers.date;
            yield put( { type: NO_ERROR } );
            yield put( { type: CLASSTIMES_SUCCESS, classTimesList, lastUpdated } );

            firebase.crashlytics().log( "operación exitosa ")
            //   Crashlytics.log( "operación exitosa " );
        }
        else {
            existListClass = yield select( state => state.classtimes.existListClass );
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: existListClass,
                errorStatus: 0,
            } );
        }
    }
    catch ( error ) {
        existListClass = yield select( state => state.classtimes.existListClass );

        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: existListClass,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: existListClass,
            } );
        }
    }
}
