import { put, call, select } from "redux-saga/effects";
import {
  LOGIN_REQUEST_ERROR,
  LOGIN_REQUEST_SUCCESS
} from "../../actions/session";

import API from "../api";
import messages from "../../config/messages";

const requestTokenFromAPI = (username, password) =>
  API({
    url: "/account/token",
    method: "POST",
    data: {
      username,
      password
    }
  });

const SESSION_TOKEN = "userToken";

const saveToken = token => localStorage.setItem(SESSION_TOKEN, token);

export function* handleLoginRequestAction(action) {
  try {
    // Check username
    if (!action.username) {
      yield put({
        type: LOGIN_REQUEST_ERROR,
        errorMessage: messages.USERNAME_NOT_SET
      });
    } else if (action.username.length > 9) {
      yield put({
        type: LOGIN_REQUEST_ERROR,
        errorMessage: messages.USERNAME_MAX_LENGTH
      });
    }

    // Check password
    else if (!action.password) {
      yield put({
        type: LOGIN_REQUEST_ERROR,
        errorMessage: messages.PASSWORD_NOT_SET
      });
    } else if (action.password.length < 6) {
      yield put({
        type: LOGIN_REQUEST_ERROR,
        errorMessage: messages.PASSWORD_MIN_LENGTH
      });
    } else if (action.password.length > 15) {
      yield put({
        type: LOGIN_REQUEST_ERROR,
        errorMessage: messages.PASSWORD_MAX_LENGTH
      });
    }

    // Send params to server
    else {
      // request token with that credentials
      const response = yield call(
        requestTokenFromAPI,
        action.username,
        action.password
      );

      // If we receive an error un response.data fires the action LOGIN_REQUEST_ERROR
      if (response.data.error) {
        yield put({
          type: LOGIN_REQUEST_ERROR,
          errorMessage: response.data.error.message
        });
      }

      // else we save the valid token in the store and navigate to App screen
      else {
        const { authorization } = response.headers;

        yield saveToken(authorization);
        yield put({ type: LOGIN_REQUEST_SUCCESS, token: authorization });
        yield (API.defaults.headers.common.Authorization = `Bearer ${authorization}`);
      }
    }
  } catch (error) {
    // TODO: in this part we handle the network request errors
    // We must check
    // - first the connection to internet in pages like google?
    // - second from firebase fetch the status of maintenance mode
    // - else is server is down display the appropriate message
    const responseError =
      error.response && error.response.data && error.response.data.message;
    let errorMessage = responseError || error.message;
    let errorMessagesee = "No se pudo realizar la acción, inténtelo más tarde";
    if (errorMessage.includes("Network Error")) {
      errorMessagesee =
        "Hubo un problema de red, verfica tu conexion o intenta nuevamente mas tarde";
    }
    yield put({
      type: LOGIN_REQUEST_ERROR,
      errorMessage: errorMessagesee
    });
  }
}

export function* handleGetStoredTokenAction(/*action*/) {
  const token = yield select(state => state.session.token);
  if (token !== null) {
    yield (API.defaults.headers.common.Authorization = `Bearer ${token}`);
  }
}
