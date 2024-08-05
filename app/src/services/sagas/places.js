import { put, select, call } from "redux-saga/effects";
import {
    AsyncStorage, Platform, Alert, Linking,
} from "react-native";
import firebase from 'react-native-firebase';
import API from "../api";

import {
    PLACES_LIST_REQUEST_SUCCESS,
} from "../../actions/places";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";

const LOCATION_COLLECTION_STATE = "@locationCollectionState";

const getList = () => API({
    url: "/places/list",
    method: "GET"
});

export function* handlegetPlacesList( /* action */) {
    firebase.crashlytics().log("Saga => handlegetPlacesList")
    try {

        const response = yield call(getList);
        if (response) {
            yield put({ type: NO_ERROR });
            yield put({ type: PLACES_LIST_REQUEST_SUCCESS, placesList: response.data });
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
