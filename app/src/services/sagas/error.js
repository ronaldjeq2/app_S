import { put, call, select } from "redux-saga/effects";
import { AsyncStorage } from "react-native";
import firebase from 'react-native-firebase';
//import { Crashlytics } from "react-native-fabric";
import { Platform } from "react-native";
import { LOGIN_REQUEST_ERROR } from "../../actions/session";
import NavigationService from "../Navigation";

import { ERROR_EXIST, ERROR_DETAIL } from "../../actions/error";
import API from "../api";
import messages from "../../config/messages";
import "../../actions/network";
import { THEME } from "../../config/styles";

const SESSION_TOKEN = "userToken";

async function getTokenFromStorage() {
    const token = await AsyncStorage.getItem(SESSION_TOKEN);

    return token;
}

const Message = [
    "No se pudo actualizar  ",
    "No se pudo realizar la acción, vuelva a intentarlo más tarde",
    "No tienes conexión a internet ",
];

const Color = ["gray", THEME.errorBackgroundColor, "gray"];

export function* handleErrorActionscreen(action) {
    existConecction = yield select(state => state.network.connected);
    const token = yield call(getTokenFromStorage);
    let indice = 0;
    if (action.errorStatus === 401) {
        firebase.crashlytics().log("Tu session a expirado")
        //  Crashlytics.log( "Tu session a expirado" );
        yield put({ type: LOGIN_REQUEST_ERROR, errorMessage: "Tu sesión expiró" });
        yield NavigationService.navigate("Logout", {});
    }
    else if (existConecction == false) {
        indice = 2;
        if (action.dataExist == false) {
            if (token) {
                yield NavigationService.navigate("Home", {});
            }
            else {
                yield NavigationService.navigate("Login", {});
            }


        }

        yield put({
            type: ERROR_DETAIL,
            error_Message: Message[indice],
            errorColor: Color[indice],
        });
    }
    else {
        firebase.crashlytics().log("Hubo un error al realizar la peticion")
        firebase.crashlytics().recordCustomError(
            'Error',
            'Oh No!',
            [
                {
                    fileName: 'error.js',
                    functionName: 'handleErrorActionscreen',
                }
            ]
        );
        //  Crashlytics.log( "Hubo un error al realizar la peticion" );

        /*         if ( Platform.OS === "ios" ) {
                //    Crashlytics.recordError( `${ action.errorDescription }` );
                }
                else {
               //     Crashlytics.logException( `${ action.errorDescription }` );
                } */

        if (action.dataExist == false) {
            indice = 1;
            if (token) {
                yield NavigationService.navigate("Home", {});
            }
            else {
                yield NavigationService.navigate("Login", {});
            }

        }

        yield put({
            type: ERROR_DETAIL,
            error_Message: Message[indice],
            errorColor: Color[indice],
        });
    }
}
