import {
    takeEvery, call, delay, spawn, all,
} from "redux-saga/effects";

import {
    LOGIN_REQUEST,
    GET_STORED_TOKEN,
    TOKEN_NOT_FOUND,
    LOGIN_REQUEST_SUCCESS,
    LOGOUT_REQUEST,
    WALK_WAS_SHOWN,
} from "../../actions/session";

import {
    handleLoginRequestAction,
    handleGetStoredTokenAction,
    handleTokenNotFoundAction,
    handleLoginRequestSuccess,
    handleLogoutRequest,
    handleWalkWasShownAction,
} from "./session";

import { SINFO_REQUEST, SINFO_LOGOUT } from "../../actions/sinfo";
import { handleSinfoRequestAction, handleSinfoLogoutAction } from "./sinfo";

import {
    COURSE_REQUEST,
    COURSE_DETAIL_REQUEST,
    COURSE_SCHEDULE_REQUEST,
    ASSISTANCE_REQUEST,
} from "../../actions/course";
import {
    handleCurrentRequestAction,
    handleDetailRequestAction,
    handleCourseScheduleRequestAction,
    handleAssistanceRequestAction,
} from "./course";

import { ACCOUNT_REQUEST_INFO } from "../../actions/student";
import { handleAccountRequestInfoAction } from "./student";

import { BIRTHDAY_REQUEST, BIRTHDAY_UPDATELIST } from "../../actions/birthday";
import { handlebirthdayRequestAction, handleUpdateListAction } from "./birthday";

import { handleErrorActionscreen } from "./error";
import { ERROR_EXIST } from "../../actions/error";

import { CLASSTIMES_REQUEST } from "../../actions/classtimes";
import { handleClasstimesRequestAction } from "./classtimes";

import { handlenNewsListRequestAction } from "./news";
import { NEWSLIST_REQUEST } from "../../actions/news";

import {
    PERMISSION_UPDATE_CURRENT_STATE,
    PERMISSION_INITIAL_REQUEST,
    PERMISSION_TOGGLE,
} from "../../actions/permissions";

import {
    handlePermissionUpdateCurrentStateAction,
    handlePermissionInitialRequestAction,
    handlePermissionToggleAction,
} from "./permissions";

import {
    handleNotificationSendTokenAction,
    handleNotificationSyncTagsAction,
    handleChangeNotificationStatus,
    handleRequestNotificationList,
} from "./notification";
import {
    NOTIFICATION_SEND_TOKEN,
    NOTIFICATION_SYNC_TAGS,
    CHANGE_STATUS_NOTIFICATION,
    GET_NOTIFICATION_LIST,
} from "../../actions/notification";

import { CHANGE_CONNECTION_STATUS } from "../../actions/network";
import { handleNetworkChangeAction } from "./network";

import {
    PAYMENTS_DETAIL_REQUEST,
    PAYMENTS_REQUEST,
    PAYMENTS_CHANGEP_PERIOD,
} from "../../actions/payments";
import { handlePaymentsDetailstRequestAction, handlePaymentstRequestAction } from "./payments";

import { APP_VERSION_REQUEST, APP_VERSION_CHECK } from "../../actions/versionApp";
import { handledetailVersionRequestAction, handlecheckVersionRequestAction } from "./appVersion";

import { PLACES_LIST_REQUEST } from "../../actions/places";
import {
    handlegetPlacesList
} from "./places";
function* sessionSaga() {
    yield takeEvery(LOGIN_REQUEST, handleLoginRequestAction);
    yield takeEvery(LOGIN_REQUEST_SUCCESS, handleLoginRequestSuccess);

    yield takeEvery(GET_STORED_TOKEN, handleGetStoredTokenAction);
    yield takeEvery(TOKEN_NOT_FOUND, handleTokenNotFoundAction);

    yield takeEvery(WALK_WAS_SHOWN, handleWalkWasShownAction);

    yield takeEvery(LOGOUT_REQUEST, handleLogoutRequest);
}

function* sinfoSaga() {
    yield takeEvery(SINFO_REQUEST, handleSinfoRequestAction);
    yield takeEvery(SINFO_LOGOUT, handleSinfoLogoutAction);
}

function* studentSaga() {
    yield takeEvery(ACCOUNT_REQUEST_INFO, handleAccountRequestInfoAction);
}

function* birthdaySaga() {
    yield takeEvery(BIRTHDAY_REQUEST, handlebirthdayRequestAction);
    yield takeEvery(BIRTHDAY_UPDATELIST, handleUpdateListAction);
}

function* courseSaga() {
    yield takeEvery(COURSE_REQUEST, handleCurrentRequestAction);
    yield takeEvery(COURSE_DETAIL_REQUEST, handleDetailRequestAction);
    yield takeEvery(COURSE_SCHEDULE_REQUEST, handleCourseScheduleRequestAction);
    yield takeEvery(ASSISTANCE_REQUEST, handleAssistanceRequestAction);
}

function* classTimesSaga() {
    /* ==== CLASSTIMES ==== */
    yield takeEvery(CLASSTIMES_REQUEST, handleClasstimesRequestAction);
}

function* errorSaga() {
    /* ==== ERROR ==== */
    yield takeEvery(ERROR_EXIST, handleErrorActionscreen);
}

function* permissionSaga() {
    /* ==== PERMISSION ==== */
    yield takeEvery(PERMISSION_UPDATE_CURRENT_STATE, handlePermissionUpdateCurrentStateAction);
    yield takeEvery(PERMISSION_INITIAL_REQUEST, handlePermissionInitialRequestAction);
    yield takeEvery(PERMISSION_TOGGLE, handlePermissionToggleAction);

    /* ==== PERMISSION ==== */
    yield takeEvery(CHANGE_CONNECTION_STATUS, handleNetworkChangeAction);
}

function* notificationSaga() {
    /* ==== NOTIFICATION ==== */
    yield takeEvery(NOTIFICATION_SEND_TOKEN, handleNotificationSendTokenAction);
    yield takeEvery(NOTIFICATION_SYNC_TAGS, handleNotificationSyncTagsAction);
    yield takeEvery(CHANGE_STATUS_NOTIFICATION, handleChangeNotificationStatus);
    yield takeEvery(GET_NOTIFICATION_LIST, handleRequestNotificationList);
}

function* newsSaga() {
    /* ==== NEWS ==== */
    yield takeEvery(NEWSLIST_REQUEST, handlenNewsListRequestAction);
}

function* paymentsSaga() {
    /* ==== Payments ==== */
    yield takeEvery(PAYMENTS_REQUEST, handlePaymentstRequestAction);
    yield takeEvery(PAYMENTS_DETAIL_REQUEST, handlePaymentsDetailstRequestAction);
    yield takeEvery(PAYMENTS_CHANGEP_PERIOD, handlePaymentsDetailstRequestAction);
}

function* versionSaga() {
    /* ==== Version Detail ==== */
    yield takeEvery(APP_VERSION_REQUEST, handledetailVersionRequestAction);
    yield takeEvery(APP_VERSION_CHECK, handlecheckVersionRequestAction);
}

function* placesSaga() {
    yield takeEvery(PLACES_LIST_REQUEST, handlegetPlacesList);
}

const makeRestartable = saga => function* () {
    yield spawn(function* () {
        while (true) {
            try {
                yield call(saga);
                console.error(
                    `unexpected on - ${saga.name} - root saga termination.
                    The root sagas are supposed to be sagas that live during the whole app lifetime!`,
                    saga,
                );
            }
            catch (e) {
                console.error("Saga error, the saga will be restarted", e);
            }
            // Avoid infinite failures blocking app TODO use backoff retry policy...
            yield delay(1000);
        }
    });
};

const rootSagas = [
    sessionSaga,
    sinfoSaga,
    studentSaga,
    birthdaySaga,
    courseSaga,
    classTimesSaga,
    errorSaga,
    permissionSaga,
    notificationSaga,
    newsSaga,
    paymentsSaga,
    versionSaga,
    placesSaga
].map(makeRestartable);

export default function* root() {
    yield all(rootSagas.map(saga => call(saga)));
}
