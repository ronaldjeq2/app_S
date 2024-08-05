import { put, call, select } from "redux-saga/effects";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import { SINFO_REQUEST_SUCCESS, SINFO_REQUEST_ERROR } from "../../actions/sinfo";

import NavigationService from "../Navigation";
import API from "../api";

const requestSSBFromAPI = token => API( {
    url: "/account/ssb",
    method: "GET",
    headers: { authorization: `Bearer ${ token }` },
} );

export function* handleSinfoRequestAction( /* action */ ) {
    firebase.crashlytics().log( "Iniciando la funcion handlenNewsListRequestAction ")

  // Crashlytics.log( "Iniciando la funcion handlenNewsListRequestAction " );

    try {
        // request SSB code
        const token = yield select( state => state.session.token );
        firebase.crashlytics().log(  "Iniciando  el llamado a requestSSBFromAPI  " )

       // Crashlytics.log( "Iniciando  el llamado a requestSSBFromAPI  " );

        const response = yield call( requestSSBFromAPI, token );

        // If we receive an error un response.data fires the action ERROR
        if ( response.data.error ) {
            yield put( {
                type: SINFO_REQUEST_ERROR,
                hasError: true,
                errorMessage: response.data.error.message,
                errorKey: response.data.error.key,
                errorLevel: response.data.error.level,
            } );
            firebase.crashlytics().log(  "operación exitosa " )

         //   Crashlytics.log( "operación exitosa " );
        }

        // else we save the valid token in the store and navigate to App screen
        else {
            const { code, uri } = response.data;
            yield put( { type: SINFO_REQUEST_SUCCESS, code, uri } );
        }
    }
    catch ( error ) {
        const { message } = error;

        let errorKey = "UNKNOWN";
        let errorLevel = "ERROR";

        if ( message === "Network Error" ) {
            errorKey = "NETWORK_ERROR";
            errorLevel = "INFO";
        }
        else if ( message.includes( "timeout" ) ) {
            errorKey = "TIMEOUT_ERROR";
            errorLevel = "INFO";
        }
        yield put( {
            type: SINFO_REQUEST_ERROR,
            hasError: true,
            errorKey,
            errorLevel,
            errorMessage: message,
        } );
    }
}

export function* handleSinfoLogoutAction() {
    firebase.crashlytics().log(  "Iniciando la funcion handleSinfoLogoutAction " )

    //Crashlytics.log( "Iniciando la funcion handleSinfoLogoutAction " );
    yield NavigationService.navigate( "Home" );
}
