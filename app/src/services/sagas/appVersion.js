import { put, call, select } from "redux-saga/effects";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import VersionCheck from "react-native-version-check";
import {
    AsyncStorage, Platform, Alert, Linking,
} from "react-native";
import API from "../api";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";
import { APP_VERSION_SUCCESS, APP_VERSION_CHECK_SUCCESS } from "../../actions/versionApp";
import { GET_STORED_TOKEN } from "../../actions/session";
import NavigationService from "../Navigation";

// SERVICIO PARA OBTENER EL DETALLE DE LA VERSION DE LA APP
const getDetailVersion = version => API( {
    url: `/version/app/${ version }`,
    method: "GET",
} );

const checkVersion = () => API( {
    url: "/version/app/listVersion",
    method: "GET",
} );

// function getLatestVersionApp() {
//     VersionCheck.getLatestVersion().then( ( latestVersion ) => {
//         console.warn( "latestVersion", new Date(), latestVersion );
//         const appversion = latestVersion;
//         return appversion;
//     } );

//     // console.warn( "appversion", appversion );
// }

function promiseAlert( {
    title = "SENATI",
    message = "Hello there!",
    accept = "Ok",
    cancel = null,
    cancelable = true,
} ) {
    return new Promise( ( resolve ) => {
        const buttons = [];
        if ( cancel ) {
            buttons.push( { text: cancel, onPress: () => resolve( false ), style: "cancel" } );
        }
        buttons.push( {
            text: accept,
            onPress: () => {
                if ( Platform.OS === "ios" ) {
                    Linking.openURL(
                        "https://itunes.apple.com/pe/app/senati-m%C3%B3vil/id1358336389?mt=8",
                    );
                }
                else {
                    Linking.openURL( "https://play.google.com/store/apps/details?id=edu.senati.app" );
                }

                resolve( true );
            },
        } );
        Alert.alert( title, message, buttons, { cancelable } );
    } );
}

export function* handledetailVersionRequestAction( action ) {
    firebase.crashlytics().log("saga => handledetailVersionRequestAction")

   // Crashlytics.log( "saga => handledetailVersionRequestAction" );
    let versionDetail = yield select( state => state.appVersion.versionDetail );
    const existInfo = versionDetail === undefined || Object.keys( versionDetail ).length > 0;
    try {
        firebase.crashlytics().log("API call => getDetailVersion")

      //  Crashlytics.log( "API call => getDetailVersion" );
        const response = yield call( getDetailVersion, action.versionApp );
        if ( response.status === 200 ) {
            versionDetail = response.data;
            yield put( { type: NO_ERROR } );
            yield put( { type: APP_VERSION_SUCCESS, versionDetail } );
            firebase.crashlytics().log("API call => getDetailVersion => 200 Ok" )

          //  Crashlytics.log( "API call => getDetailVersion => 200 Ok" );
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

export function* handlecheckVersionRequestAction( action ) {
    firebase.crashlytics().log("saga => handlecheckVersionRequestAction"  )

    //Crashlytics.log( "saga => handlecheckVersionRequestAction" );
    const currentVersion = VersionCheck.getCurrentVersion();
    let forceUpdate = false;
    let sugestUpdate = false;
    try {
        const response = yield call( checkVersion );

        if ( response.status === 200 ) {
            if ( currentVersion in response.data ) {
                forceUpdate = response.data[ currentVersion ].forceUpdate;
                sugestUpdate = response.data[ currentVersion ].sugestUpdate;
            }

            yield put( { type: NO_ERROR } );
            yield put( { type: APP_VERSION_SUCCESS, forceUpdate, sugestUpdate } );
            if ( forceUpdate ) {
                yield NavigationService.navigate( "UpdatedApp", {} );
            }
            if ( sugestUpdate ) {
                const wantReciveUpdated = yield promiseAlert( {
                    message:
                        "Tenemos muchas novedades para tí, por favor actualiza la versión de la App",
                    accept: "!Claro que sí!",
                    cancel: "Ahora no",
                    cancelable: false,
                } );
            }
            firebase.crashlytics().log("API call => getDetailVersion => 200 Ok")

           // Crashlytics.log( "API call => getDetailVersion => 200 Ok" );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: true,
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
                dataExist: true,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: true,
            } );
        }
    }
}
