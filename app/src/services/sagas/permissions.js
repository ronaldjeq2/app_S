import { put, select } from "redux-saga/effects";
import {
    AsyncStorage, Platform, Alert, Linking,
} from "react-native";
import firebase from 'react-native-firebase';
//import { Crashlytics } from "react-native-fabric";
import OneSignal from "react-native-onesignal";
import Permissions from "react-native-permissions";

import {
    PERMISSION_UPDATE_CURRENT_STATE,
    PERMISSION_UPDATE_SUBSCRIPTION_STATE,
    PERMISSION_UPDATE_SHARED_LOCATION_STATE,
} from "../../actions/permissions";

const LOCATION_COLLECTION_STATE = "@locationCollectionState";

function getPermissionSubscriptionState() {
    return new Promise( ( resolve /* , reject */ ) => {
        OneSignal.getPermissionSubscriptionState( ( status ) => {
            resolve( status );
        } );
    } );
}

export function* handlePermissionUpdateCurrentStateAction() {
    firebase.crashlytics().log("Iniciando la funcion handlePermissionUpdateCurrentStateAction ")
    firebase.crashlytics().log("llamando a la funcion getPermissionSubscriptionState ")

    //Crashlytics.log( "Iniciando la funcion handlePermissionUpdateCurrentStateAction " );
   // Crashlytics.log( "llamando a la funcion getPermissionSubscriptionState " );

    const subscriptionState = yield getPermissionSubscriptionState();

    if ( Platform.OS === "ios" ) {
        subscriptionState.nativeState = yield Permissions.check( "notification" );
    }
    else {
        subscriptionState.nativeState = subscriptionState.notificationsEnabled === "true" ? "authorized" : "denied";
    }
    yield put( {
        type: PERMISSION_UPDATE_SUBSCRIPTION_STATE,
        subscriptionState: {
            nativeState: subscriptionState.nativeState,
            notificationsEnabled:
                subscriptionState.notificationsEnabled === "true"
                || subscriptionState.notificationsEnabled === true,
            pushToken: subscriptionState.pushToken,
            subscriptionEnabled:
                subscriptionState.subscriptionEnabled === "true"
                || subscriptionState.subscriptionEnabled === true,
            userId: subscriptionState.userId,
            userSubscriptionEnabled:
                subscriptionState.userSubscriptionEnabled === "true"
                || subscriptionState.subscriptionEnabled === true,
        },
    } );

    const locationSharedState = yield Permissions.check( "location" );
    const locationCollectionState = yield AsyncStorage.getItem( LOCATION_COLLECTION_STATE );

    let locationSharedEnabled = false;

    if (
        locationSharedState === "authorized"
        && ( locationCollectionState === null || locationCollectionState === "true" )
    ) {
        locationSharedEnabled = true;
    }

    const locationShared = {
        nativeState: locationSharedState,
        enabled: locationSharedEnabled,
    };

    yield put( { type: PERMISSION_UPDATE_SHARED_LOCATION_STATE, locationShared } );
}

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
        buttons.push( { text: accept, onPress: () => resolve( true ) } );
        Alert.alert( title, message, buttons, { cancelable } );
    } );
}

async function checkIfAlreadyAsk( storagePermissionName ) {
    const state = await AsyncStorage.getItem( storagePermissionName );
    return state === "true";
}

const ALREADY_ASK_NOTIFICATION = "@alreadyAskFor:Notification";
const ALREADY_ASK_LOCATION = "@alreadyAskFor:Location";

export function* handlePermissionInitialRequestAction() {
    firebase.crashlytics().log("Iniciando la funcion handlePermissionUpdateCurrentStateAction ")

    //Crashlytics.log( "Iniciando la funcion handlePermissionUpdateCurrentStateAction " );

    // request the push notification permission
    if ( Platform.OS === "ios" ) {
        const alreadyAskNotification = yield checkIfAlreadyAsk( ALREADY_ASK_NOTIFICATION );
        if ( !alreadyAskNotification ) {
            const wantReceiveNotification = yield promiseAlert( {
                message: "Deseas recibir notificaciones de acuerdo a tu ubicacion",
                accept: "!Claro que sí!",
                cancel: "Ahora no",
                cancelable: false,
            } );
            yield AsyncStorage.setItem( ALREADY_ASK_NOTIFICATION, "true" );

            let notificationPermissionStatus = "denied";
            if ( wantReceiveNotification ) {
                notificationPermissionStatus = yield Permissions.request( "notification" );
            }
            if ( !wantReceiveNotification || notificationPermissionStatus === "denied" ) {
                yield promiseAlert( {
                    title: null,
                    message: "Puedes activarla luego en la sección 'Mi Cuenta > Configuraciones'",
                    accept: "Entendido",
                    cancelable: false,
                } );
            }
            else if ( notificationPermissionStatus === "restricted" ) {
                yield promiseAlert( {
                    title: "No fue posible activar las notificaciones",
                    message:
                        "Esto es debido a que tu dispositivo no tiene soporte para ello o esta bloqueado a causa de controles parentales",
                    accept: "Entendido",
                    cancelable: false,
                } );
            }
        }
    }
    /**
     * ONLY FOR TEST
     */
    // yield AsyncStorage.removeItem( ALREADY_ASK_LOCATION );

    // request the Location Permission
    const alreadyAskLocation = yield checkIfAlreadyAsk( ALREADY_ASK_LOCATION );

    if ( !alreadyAskLocation ) {
        const wantToShareLocation = yield promiseAlert( {
            message: "¿Quieres recibir notificaciones de acuerdo a tu ubicación?",
            accept: "!Claro que sí!",
            cancel: "Ahora no",
            cancelable: false,
        } );
        yield AsyncStorage.setItem( ALREADY_ASK_LOCATION, "true" );

        let locationPermissionStatus = "denied";
        if ( wantToShareLocation ) {
            locationPermissionStatus = yield Permissions.request( "location" );
        }
        if ( !wantToShareLocation || locationPermissionStatus === "denied" ) {
            yield promiseAlert( {
                title: null,
                message: "Puedes activarla luego en la sección 'Mi Cuenta > Configuraciones'",
                accept: "Entendido",
                cancelable: false,
            } );
        }
        else if ( locationPermissionStatus === "restricted" ) {
            yield promiseAlert( {
                title: "No es posible activar la ubicacion",
                message:
                    "Esto es debido a que tu dispositivo no tiene soporte para ello o esta bloqueado a causa de controles parentales",
                accept: "Entendido",
                cancelable: false,
            } );
        }
    }
    yield put( { type: PERMISSION_UPDATE_CURRENT_STATE } );
}

function configurationAlert( { title = "", canOpenSettings = false } ) {
    return new Promise( ( resolve ) => {
        const message = "Debes activar la opcion en la sección de configuracion de tu dispositivo";
        let buttons = [];

        if ( canOpenSettings ) {
            buttons = [
                {
                    text: "Configurar Ahora",
                    onPress: () => {
                        Linking.openURL( "app-settings:" );
                        resolve( false );
                    },
                },
                { text: "Cancelar", onPress: () => resolve( false ), style: "cancel" },
            ];
        }
        else {
            buttons = [ { text: "Ok", onPress: () => resolve( true ), style: "cancel" } ];
        }

        Alert.alert( title, message, buttons, { cancelable: false } );
    } );
}

export function* handlePermissionToggleAction( action ) {
    const currentState = {
        nativeState: "undetermined",
        enabled: false,
    };

    switch ( action.permissionName ) {
    case "notification":
        currentState.enabled = yield select(
            state => state.permissions.subscriptionState.subscriptionEnabled,
        );
        currentState.nativeState = yield select(
            state => state.permissions.subscriptionState.nativeState,
        );
        break;
    case "location":
        currentState.enabled = yield select( state => state.permissions.locationShared.enabled );
        currentState.nativeState = yield select(
            state => state.permissions.locationShared.nativeState,
        );
        break;
    default:
        break;
    }
    const nextValue = !currentState.enabled;
    // Go!, change the value
    if ( currentState.nativeState === "authorized" ) {
        switch ( action.permissionName ) {
        case "notification":
            yield OneSignal.setSubscription( nextValue );
            break;
        case "location":
            yield OneSignal.setLocationShared( nextValue );
            yield AsyncStorage.setItem( LOCATION_COLLECTION_STATE, nextValue ? "true" : "false" );
            break;
        default:
            break;
        }
    }
    // show alert with configuration link
    else if ( currentState.nativeState === "denied" ) {
        // show configuration alert
        // and they later should be update again the value?
        yield OneSignal.setSubscription( nextValue );

        let title = "Notificaciones bloqueadas";
        if ( action.permissionName === "location" ) {
            title = "Ubicacion bloqueada";
        }

        const canOpenSettings = yield Linking.canOpenURL( "app-settings:" );
        yield configurationAlert( {
            title,
            canOpenSettings,
        } );
    }
    // show message is not possible change the status
    else if ( currentState.nativeState === "restricted" ) {
        // only show information
        let title = "No es posible activar las notificaciones";
        if ( action.permissionName === "location" ) {
            title = "No es posible activar la ubicacion";
        }

        yield promiseAlert( {
            title,
            message:
                "Esto es debido a que tu dispositivo no tiene soporte para ello o esta bloqueado a causa de controles parentales",
            accept: "Entendido",
            cancelable: false,
        } );
    }
    // rare case, because we should be ask for permissions on HomeScreen
    // in any case we shows a message for request permission
    else if ( currentState.nativeState === "undetermined" ) {
        // request permission
        switch ( action.permissionName ) {
        case "location":
            yield OneSignal.promptLocation();
            break;
        case "notification":
            yield OneSignal.registerForPushNotifications();
            break;
        default:
            break;
        }
    }
    yield put( { type: PERMISSION_UPDATE_CURRENT_STATE } );
}
