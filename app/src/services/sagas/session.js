/* eslint-disable linebreak-style */
import {
    put, call, select, all, delay
} from "redux-saga/effects";
import { AsyncStorage } from "react-native";
//import { Answers } from "react-native-fabric";
import firebase from 'react-native-firebase';
import subDays from "date-fns/sub_days";
import differenceInSeconds from "date-fns/difference_in_seconds";
import OneSignal from "react-native-onesignal";
import NavigationService from "../Navigation";

import {
    LOGIN_REQUEST_SUCCESS,
    LOGIN_REQUEST_ERROR,
    TOKEN_NOT_FOUND,
    AUTH_LOADER_MESSAGE,
} from "../../actions/session";
import { NOTIFICATION_SEND_TOKEN, NOTIFICATION_SYNC_TAGS } from "../../actions/notification";
import { ACCOUNT_REQUEST_INFO } from "../../actions/student";
import { BIRTHDAY_REQUEST } from "../../actions/birthday";
import { CLASSTIMES_REQUEST } from "../../actions/classtimes";
import { PAYMENTS_REQUEST } from "../../actions/payments";
import { APP_VERSION_CHECK } from "../../actions/versionApp";
import API from "../api";
import messages from "../../config/messages";
import settings from "../../config/settings";

const requestTokenFromAPI = (username, password) => API({
    url: "/account/token",
    method: "POST",
    data: {
        username,
        password,
    },
});

const SESSION_TOKEN = "userToken";
const SESSION_WALK = "walkVersion";

const saveToken = token => AsyncStorage.setItem(SESSION_TOKEN, token);

export function* handleLoginRequestAction(action) {
    try {
        // Check username
        if (!action.username) {
            yield put({ type: LOGIN_REQUEST_ERROR, errorMessage: messages.USERNAME_NOT_SET });
        }
        else if (action.username.length > 9) {
            yield put({ type: LOGIN_REQUEST_ERROR, errorMessage: messages.USERNAME_MAX_LENGTH });
        }

        // Check password
        else if (!action.password) {
            yield put({ type: LOGIN_REQUEST_ERROR, errorMessage: messages.PASSWORD_NOT_SET });
        }
        else if (action.password.length < 6) {
            yield put({ type: LOGIN_REQUEST_ERROR, errorMessage: messages.PASSWORD_MIN_LENGTH });
        }
        else if (action.password.length > 15) {
            yield put({ type: LOGIN_REQUEST_ERROR, errorMessage: messages.PASSWORD_MAX_LENGTH });
        }

        // Send params to server
        else {
            // request token with that credentials
            const response = yield call(requestTokenFromAPI, action.username, action.password);

            // If we receive an error un response.data fires the action LOGIN_REQUEST_ERROR
            if (response.data.error) {
                yield put({
                    type: LOGIN_REQUEST_ERROR,
                    errorMessage: response.data.error.message,
                });
            }

            // else we save the valid token in the store and navigate to App screen
            else {
                //   Answers.logLogin( "login", true );

                const { authorization } = response.headers;
                yield saveToken(authorization);
                yield put({ type: LOGIN_REQUEST_SUCCESS, token: authorization });
            }
        }
    }
    catch (error) {
        // TODO: in this part we handle the network request errors
        // We must check
        // - first the connection to internet in pages like google?
        // - second from firebase fetch the status of maintenance mode
        // - else is server is down display the appropriate message
        const responseError = error.response && error.response.data && error.response.data.message;
        let errorMessage = responseError || error.message;
        if (errorMessage.includes("Network Error")) {
            errorMessage = "Hubo un problema de red, verfica tu conexion o intenta nuevamente mas tarde";
        }
        yield put({
            type: LOGIN_REQUEST_ERROR,
            errorMessage,
        });
    }
}

async function getWalkVersionFromStorage() {
    const walkVersion = await AsyncStorage.getItem(SESSION_WALK);
    return walkVersion;
}

export function* handleLoginRequestSuccess(action) {
    // Set the default Authorization header token in Axios instance
    yield (API.defaults.headers.common.Authorization = `Bearer ${action.token}`);

    // Get All data for offline if not have data yet
    yield put({ type: AUTH_LOADER_MESSAGE, message: "Descargando información ..." });

    const lastUpdatedStudent = yield select(state => state.student.lastUpdated);
    const lastUpdatedBirthday = yield select(state => state.birthday.lastUpdated);
    const lastUpdatedClasstimes = yield select(state => state.classtimes.lastUpdated);

    const today = new Date().toISOString().split("T")[0];

    if (!lastUpdatedStudent || !lastUpdatedBirthday || !lastUpdatedClasstimes) {
        yield all([
            put({ type: ACCOUNT_REQUEST_INFO }),
            put({ type: BIRTHDAY_REQUEST, ref_date: today }),
            put({ type: CLASSTIMES_REQUEST, actualDate: today }),
            put({ type: PAYMENTS_REQUEST }),
        ]);
    }

    // OneSignal
    const notificationState = yield select(state => state.notification);
    const lastSynced = notificationState.lastSynced || subDays(new Date(), 1);
    const timeElapsedSinceLastSync = differenceInSeconds(new Date(), lastSynced);

    if (timeElapsedSinceLastSync > settings.oneSignalSyncTagsTimeLapse) {
        yield all([put({ type: NOTIFICATION_SEND_TOKEN }), put({ type: NOTIFICATION_SYNC_TAGS })]);
    }

    const walkFromStorage = yield call(getWalkVersionFromStorage);
    const showWalk = !walkFromStorage || walkFromStorage !== settings.appVersion;

    const pidm = yield select(state => state.student.pidm);

    // Redirect to App Stack "Home"
    yield NavigationService.navigate(showWalk ? "Walk" : "App", {});
}

async function getTokenFromStorage() {
    const token = await AsyncStorage.getItem(SESSION_TOKEN);

    return token;
}

export function* handleGetStoredTokenAction( /* action */) {
    const token = yield call(getTokenFromStorage);

    if (token) {
        yield put({ type: LOGIN_REQUEST_SUCCESS, token });
        yield put({ type: APP_VERSION_CHECK });
    }
    else {
        yield (API.defaults.headers.common.Authorization = null);
        yield put({ type: TOKEN_NOT_FOUND });
    }
}

export function* handleWalkWasShownAction() {
    yield AsyncStorage.setItem(SESSION_WALK, settings.appVersion);
    yield NavigationService.navigate("App");
}

export function* handleTokenNotFoundAction() {
    yield NavigationService.navigate("Login", {});
    yield put({ type: APP_VERSION_CHECK });
}

export function* handleLogoutRequest() {
    API.defaults.headers.common.Authorization = null;

    const keysToRemoveFromStorage = [SESSION_TOKEN, SESSION_WALK];
    yield AsyncStorage.multiRemove(keysToRemoveFromStorage);
    yield OneSignal.removeExternalUserId();
    yield call(settings.persistor.purge);
    yield delay(settings.logoutScreenDelay);
    yield NavigationService.navigate("Login", {});
}
