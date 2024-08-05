import { put, call, select } from "redux-saga/effects";
import firebase from 'react-native-firebase';

//import { Crashlytics } from "react-native-fabric";
import { ACCOUNT_REQUEST_INFO_SUCCESS } from "../../actions/student";
import OneSignal from "react-native-onesignal";

import API from "../api";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";

export const requestAccountInfo = token => API( {
    url: "/account/info",
    method: "POST",
    data: {},
    headers: { Authorization: `Bearer ${ token }` },
} );

export function* handleAccountRequestInfoAction( /* action */ ) {
    firebase.crashlytics().log("testito prod Ronald firebase 1.9.1")

   // Crashlytics.log( "Iniciando la funcion handleAccountRequestInfoAction " );

    const TOKEN = yield select( state => state.session.token );
    const studentId = yield select( state => state.student.id );

    if ( studentId !== null ) {
        firebase.crashlytics().setUserIdentifier(studentId)
        firebase.analytics().setUserId(studentId)
      //  Crashlytics.setUserIdentifier( studentId );
    }

    try {
        firebase.crashlytics().log( "Iniciando  el llamado a requestAccountInfo  " )

       // Crashlytics.log( "Iniciando  el llamado a requestAccountInfo  " );

        const response = yield call( requestAccountInfo, TOKEN );
        if ( response.status === 200 ) {
            const userInfo = response.data;
            if ( response.data && response.data.id ) {
                firebase.crashlytics().setUserIdentifier(response.data.id )
                firebase.analytics().setUserId(response.data.id)

            //    Crashlytics.setUserIdentifier( response.data.id );
                try {
                    // OneSignal
                    yield OneSignal.removeExternalUserId();
                    yield OneSignal.setExternalUserId( userInfo.pidm.toString() );
                }
                catch ( error ) {
                    firebase.crashlytics().log(`Existe un error con el método de OneSignal para el usuario con el Token ${action.token}`)

                 //   Crashlytics.log(`Existe un error con el método de OneSignal para el usuario con el Token ${action.token}`)
                }
            }
            const lastUpdated = response.headers.date;
            userInfo.lastUpdated = lastUpdated;
            yield put( { type: ACCOUNT_REQUEST_INFO_SUCCESS, userInfo } );
            yield put( { type: NO_ERROR } );
            firebase.crashlytics().log("operación exitosa ")

         //   Crashlytics.log( "operación exitosa " );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: studentId !== null,
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
                dataExist: studentId !== null,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: studentId !== null,
            } );
        }
    }
}
