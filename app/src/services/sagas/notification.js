import { put, call, select } from "redux-saga/effects";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import OneSignal from "react-native-onesignal";

import {
    NOTIFICATION_SEND_TOKEN_SUCCESS,
    NOTIFICATION_SYNC_TAGS_SUCCESS,
    UPDATED_NOTIFICATION,
    GET_NOTIFICATION_LIST,
    GET_NOTIFICATION_LIST_SUCCESS,
} from "../../actions/notification";
import { ERROR_EXIST } from "../../actions/error";

import API from "../api";

const sendNotificationToken = subscriptionUserId => API({
    url: "/account/notification/token",
    method: "POST",
    data: {
        token: subscriptionUserId,
    },
});

function getPermissionSubscriptionState() {
    return new Promise((resolve /* , reject */) => {
        OneSignal.getPermissionSubscriptionState((status) => {
            resolve(status);
        });
    });
}

export function* handleNotificationSendTokenAction( /* action */) {
    firebase.crashlytics().log("Saga => handleNotificationSendTokenAction")

    // Crashlytics.log( "Saga => handleNotificationSendTokenAction" );

    try {
        const subscriptionState = yield getPermissionSubscriptionState();

        const response = yield call(sendNotificationToken, subscriptionState.userId);
        if (!response.data.error) {
            yield put({ type: NOTIFICATION_SEND_TOKEN_SUCCESS, token: subscriptionState.userId });
        }
    }
    catch (error) {
        if (error.response === undefined) {
            yield put({
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: false,
            });
        }
        else {
            yield put({
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: false,
            });
        }
    }
}

const requestNotificationTagList = () => API({
    url: "/account/notification/tags",
    method: "GET",
});

function getOneSignalTagList() {
    return new Promise((resolve /* , reject */) => {
        OneSignal.getTags((tags) => {
            resolve(tags || {});
        });
    });
}
export function* handleChangeNotificationStatus(action) {
    try {
        const notificationName = action.notificationInfo;
        const notificationList = yield select(state => state.notification.notificationList);
        notificationList[notificationName].isActive = !notificationList[notificationName].isActive;
        let allNotificationIsActive = false;

        const count = Object.values(notificationList).filter(obj => obj.isActive === false);
        allNotificationIsActive = !count.length > 0;

        yield put({ type: UPDATED_NOTIFICATION, notificationList, allNotificationIsActive });
    }
    catch (e) {
        console.warn("error", e);
    }
}

export function* handleNotificationSyncTagsAction() {
    try {
        const response = yield call(requestNotificationTagList);

        const serverTags = response.data.tags;
        const onesignalTags = yield call(getOneSignalTagList);

        const missingTags = {};

        Object.keys(serverTags).forEach((key) => {
            // Missing: if key is not in onesignal list
            if (!(key in onesignalTags)) {
                missingTags[key] = serverTags[key];
            }
            // Updated: if key are in onesignal but value are different
            else if (key in onesignalTags && serverTags[key] !== onesignalTags[key]) {
                missingTags[key] = serverTags[key];
            }
        });

        // Send missing or tags if there are any
        if (Object.keys(missingTags).length > 0) {
            OneSignal.sendTags(missingTags);
        }

        // Delete tags that doesn't exist in server tags
        Object.keys(onesignalTags).forEach((key) => {
            if (!(key in serverTags)) {
                OneSignal.deleteTag(key);
            }
        });

        yield put({
            type: NOTIFICATION_SYNC_TAGS_SUCCESS,
            syncDate: response.headers.date,
            tags: serverTags,
        });
    }
    catch (error) {
        if (error.response === undefined) {
            yield put({
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: false,
            });
        }
        else {
            yield put({
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: false,
            });
        }
    }
}

const requestNotificationList = () => API({
    url: "/account/notification",
    method: "GET",
});

export function* handleRequestNotificationList( /* action */) {
    firebase.crashlytics().log("Saga => handleRequestNotificationList")

    // Crashlytics.log( "Saga => handleRequestNotificationList" );

    try {
        const response = yield call(requestNotificationList);
        if (!response.data.error) {
            yield put({ type: GET_NOTIFICATION_LIST_SUCCESS, notificationList: response.data });
        }
    }
    catch (error) {
        if (error.response === undefined) {
            yield put({
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: false,
            });
        }
        else {
            yield put({
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: false,
            });
        }
    }
}
