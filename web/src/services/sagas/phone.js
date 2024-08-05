import { put, call, select } from "redux-saga/effects";
import {
  GET_LIST_PHONES_SUCCESS,
  ADD_PHONE_FINISHED,
  SEND_PHONE_CODE,
  SEND_PHONE_CODE_FINISHED,
  VALIDATE_PHONE_CODE_FINISHED,
  DELETE_PHONE_FINISHED
} from "../../actions/phone";
import { SHOW_MESSAGE } from "../../actions/error";
import Swal from "sweetalert2";

import API from "../api";
import history from "../history";

const getPhonesApi = () =>
  API({
    url: "/account/phones",
    method: "GET"
  });
const addPhoneApi = phone_number =>
  API({
    url: "/account/phones",
    method: "POST",
    data: {
      phone_number
    }
  });
const sendPhoneCodeApi = phone_id =>
  API({
    url: `/account/phones/${phone_id}/actions/send_verification_code`,
    method: "POST",
    data: {
      phone_id
    }
  });
const validatePhoneCodeApi = (phone_id, verification_code) =>
  API({
    url: `/account/phones/${phone_id}/actions/validate_verification_code`,
    method: "POST",
    data: {
      verification_code
    }
  });

const deletePhoneApi = phone_id =>
  API({
    url: `/account/phones/${phone_id}`,
    method: "DELETE"
  });

export function* handleGetPhoneList(action) {
  let phoneList = yield select(state => state.phone.phoneList);

  try {
    const response = yield call(getPhonesApi);
    if (response.status === 200) {
      phoneList = response.data;
      yield put({
        type: GET_LIST_PHONES_SUCCESS,
        phoneList
      });
    }
    if (response.data.error) {
      console.log("error2");
    }
  } catch (error) {
    console.log("error");
    console.log(error);
    yield put({
      type: GET_LIST_PHONES_SUCCESS,
      phoneList
    });
  }
}
export function* handlePhoneAdd(action) {
  try {
    const response = yield call(addPhoneApi, action.phone);
    yield put({
      type: ADD_PHONE_FINISHED
    });
    if (response.status === 201) {
      //const { phoneInfo } = response.data;
      // const {phone_id} = phoneInfo
      yield put({
        type: SEND_PHONE_CODE,
        phoneToValidateInfo: response.data,
        showAlert: true
      });
    }
    if (response.data.error) {
      yield put({
        type: SHOW_MESSAGE,
        errorMessage: response.data.error.message
      });
      console.log("error2 ");
    }
  } catch (error) {
    yield put({
      type: SHOW_MESSAGE,
      errorMessage: "No se pudo realizar la acción, inténtelo más tarde "
    });
    yield put({
      type: ADD_PHONE_FINISHED
    });
    console.log("error");
    console.log(error);
  }
}

export function* handlePhoneSendCode(action) {
  let phoneToValidateInfo = yield select(
    state => state.phone.phoneToValidateInfo
  );
  const showAlert = action.showAlert;
  try {
    const { phone_id } = action.phoneToValidateInfo;
    const response = yield call(sendPhoneCodeApi, encodeURIComponent(phone_id));
    let goToVerify = false;
    const goToHome =
      response.data.error && response.data.error.type === "ALREADY_VERIFIED";

    if (response.data.error) {
      const errorResponse = response.data.error;
      if (
        errorResponse.type &&
        errorResponse.type === "MINIMUM_RETRY_TIME" &&
        !showAlert
      ) {
        goToVerify = true;
      } else {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: `${response.data.error.message}`
        });
      }
    } else {
      phoneToValidateInfo = response.data;
      goToVerify = true;
    }

    yield put({
      type: SEND_PHONE_CODE_FINISHED,
      phoneToValidateInfo
    });
    if (goToVerify) {
      history.push(`${process.env.PUBLIC_URL}/telefono/verificar`);
    }

    if (goToHome) {
      history.push(`${process.env.PUBLIC_URL}/`);
    }
  } catch (error) {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: `No se pudo realizar la acción, inténtelo más tarde`
    });
    yield put({
      type: SEND_PHONE_CODE_FINISHED,
      phoneToValidateInfo
    });
  }
}

export function* handlePhoneValidateCode(action) {
  let phoneToValidateInfo = yield select(
    state => state.phone.phoneToValidateInfo
  );
  try {
    const { phone_id } = phoneToValidateInfo;
    const response = yield call(
      validatePhoneCodeApi,
      encodeURIComponent(phone_id),
      action.PhoneCode
    );

    if (response.data.error) {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: `${response.data.error.message}`
      });
    } else {
      Swal.fire({
        type: "success",
        title: "Teléfono validado",
        text: "El número fue validado satisfactoriamente!"
      });
      phoneToValidateInfo = response.data;
      history.push(`${process.env.PUBLIC_URL}/`);
    }

    yield put({
      type: VALIDATE_PHONE_CODE_FINISHED,
      phoneToValidateInfo
    });
    // history.push("/telefono/confirmar");
  } catch (error) {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: `No se pudo realizar la acción, inténtelo más tarde`
    });
    yield put({
      type: VALIDATE_PHONE_CODE_FINISHED,
      phoneToValidateInfo
    });
  }
}

export function* handlePhoneDelete(action) {
  try {
    const response = yield call(
      deletePhoneApi,
      encodeURIComponent(action.phone_id)
    );

    if (response.data.error) {
      yield put({
        type: SHOW_MESSAGE,
        errorMessage: response.data.error.message
      });
      Swal.fire("Eliminado!", "No se pudo realizar la acción", "success");

      console.log("error2 ");
    } else {
      Swal.fire("Eliminado!", "El número fue eliminado", "success");
    }

    yield put({
      type: DELETE_PHONE_FINISHED
    });
    history.push(`${process.env.PUBLIC_URL}/`);
  } catch (error) {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: `No se pudo realizar la acción, inténtelo más tarde`
    });
    /*     yield put({
      type: SHOW_MESSAGE,
      errorMessage: "No se pudo realizar la acción, inténtelo más tarde "
    }); */
    yield put({
      type: DELETE_PHONE_FINISHED
    });
    history.push(`${process.env.PUBLIC_URL}/`);
    console.log("error");
    console.log(error);
  }
}
