import { takeEvery, call, spawn, all } from "redux-saga/effects";

import { LOGIN_REQUEST, GET_STORED_TOKEN } from "../../actions/session";

import {
  handleLoginRequestAction,
  handleGetStoredTokenAction
} from "./session";

import {
  handleGetEmailList,
  handleEmailAdd,
  handleEmailSendCode,
  handleEmailValidateCode,
  handleEmailDelete,
  handleGetTypeEmailList
} from "./email";
import {
  GET_LIST_EMAILS,
  ADD_EMAIL,
  SEND_EMAIL_CODE,
  VALIDATE_EMAIL_CODE,
  DELETE_EMAIL,
  GET_LIST_TYPES_EMAILS
} from "../../actions/email";
import {
  handleGetPhoneList,
  handlePhoneAdd,
  handlePhoneSendCode,
  handlePhoneValidateCode,
  handlePhoneDelete
} from "./phone";
import {
  GET_LIST_PHONES,
  ADD_PHONE,
  SEND_PHONE_CODE,
  VALIDATE_PHONE_CODE,
  DELETE_PHONE
} from "../../actions/phone";
import { ACCOUNT_REQUEST_INFO } from "../../actions/user";
import { handleAccountRequestInfoAction } from "./user";

function* sessionSaga() {
  yield takeEvery(LOGIN_REQUEST, handleLoginRequestAction);
  yield takeEvery(GET_STORED_TOKEN, handleGetStoredTokenAction);
}

function* emailSaga() {
  yield takeEvery(GET_LIST_EMAILS, handleGetEmailList);
  yield takeEvery(ADD_EMAIL, handleEmailAdd);
  yield takeEvery(SEND_EMAIL_CODE, handleEmailSendCode);
  yield takeEvery(VALIDATE_EMAIL_CODE, handleEmailValidateCode);
  yield takeEvery(DELETE_EMAIL, handleEmailDelete);
  yield takeEvery(GET_LIST_TYPES_EMAILS, handleGetTypeEmailList);
}

function* phoneSaga() {
  yield takeEvery(GET_LIST_PHONES, handleGetPhoneList);
  yield takeEvery(ADD_PHONE, handlePhoneAdd);
  yield takeEvery(SEND_PHONE_CODE, handlePhoneSendCode);
  yield takeEvery(VALIDATE_PHONE_CODE, handlePhoneValidateCode);
  yield takeEvery(DELETE_PHONE, handlePhoneDelete);
}
function* userSaga() {
  yield takeEvery(ACCOUNT_REQUEST_INFO, handleAccountRequestInfoAction);
}
const makeRestartable = saga =>
  function*() {
    yield spawn(function*() {
      while (true) {
        try {
          yield call(saga);
          console.error(
            `unexpected on - ${saga.name} - root saga termination.
                    The root sagas are supposed to be sagas that live during the whole app lifetime!`,
            saga
          );
        } catch (e) {
          console.error("Saga error, the saga will be restarted", e);
        }
        // Avoid infinite failures blocking app TODO use backoff retry policy...
        // yield delay(1000);
      }
    });
  };

const rootSagas = [sessionSaga, emailSaga, phoneSaga, userSaga].map(
  makeRestartable
);

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)));
}
