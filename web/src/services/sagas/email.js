import { put, call, select } from "redux-saga/effects";
import {
  GET_LIST_EMAILS_SUCCESS,
  ADD_EMAIL_FINISHED,
  SEND_EMAIL_CODE,
  SEND_EMAIL_CODE_FINISHED,
  VALIDATE_EMAIL_CODE_FINISHED,
  DELETE_EMAIL_FINISHED,
  GET_LIST_TYPES_EMAILS_SUCCESS
} from "../../actions/email";
import { SHOW_MESSAGE } from "../../actions/error";
import API from "../api";
import history from "../history";
import Swal from "sweetalert2";

const getEmailsApi = () =>
  API({
    url: "/account/emails",
    method: "GET"
  });

const getTypeEmailsApi = () =>
  API({
    url: "/account/emails/types",
    method: "GET"
  });

const addEmailApi = (email_address, email_type_code) =>
  API({
    url: "/account/emails",
    method: "POST",
    data: {
      email_address,
      email_type_code
    }
  });

const sendEmailCodeApi = email_id =>
  API({
    url: `/account/emails/${email_id}/actions/send_verification_code`,
    method: "POST",
    data: {
      email_id
    }
  });

const validateEmailCodeApi = (email_id, verification_code) =>
  API({
    url: `/account/emails/${email_id}/actions/validate_verification_code`,
    method: "POST",
    data: {
      verification_code
    }
  });

const deleteEmailApi = email_id =>
  API({
    url: `/account/emails/${email_id}`,
    method: "DELETE"
  });

export function* handleGetEmailList(action) {
  let emailList = yield select(state => state.email.emailList);

  try {
    const response = yield call(getEmailsApi);
    if (response.status === 200) {
      emailList = response.data;

      yield put({
        type: GET_LIST_EMAILS_SUCCESS,
        emailList
      });
    }
    if (response.data.error) {
      console.log("error2");
    }
  } catch (error) {
    yield put({
      type: GET_LIST_EMAILS_SUCCESS,
      emailList
    });
    console.log("error");
    console.log(error);
  }
}
export function* handleGetTypeEmailList(/*action*/) {
  let typeEmailList = yield select(state => state.email.typeEmailList);

  try {
    const response = yield call(getTypeEmailsApi);
    if (response.status === 200) {
      typeEmailList = response.data;
    }
    if (response.data.error) {
      console.log("error2");
    }
    yield put({
      type: GET_LIST_TYPES_EMAILS_SUCCESS,
      typeEmailList
    });
  } catch (error) {
    yield put({
      type: GET_LIST_TYPES_EMAILS_SUCCESS,
      typeEmailList
    });
    console.log("error");
    console.log(error);
  }
}

export function* handleEmailAdd(action) {
  try {
    const response = yield call(addEmailApi, action.email, action.typeEmail);
    yield put({
      type: ADD_EMAIL_FINISHED
    });
    if (response.status === 201) {
      yield put({
        type: SEND_EMAIL_CODE,
        emailToValidateInfo: response.data,
        showAlert: false
      });
    }
    if (response.data.error) {
      //   Swal.fire({
      //     type: "error",
      //     title: "Oops...",
      //     text: `${response.data.error.message}`
      //   });
      yield put({
        type: SHOW_MESSAGE,
        errorMessage: response.data.error.message
      });
    }
  } catch (error) {
    yield put({
      type: SHOW_MESSAGE,
      errorMessage: "No se pudo realizar la acción, inténtelo más tarde "
    });
    yield put({
      type: ADD_EMAIL_FINISHED
    });
    console.log("error");
    console.log(error);
  }
}

export function* handleEmailSendCode(action) {
  let emailToValidateInfo = yield select(
    state => state.email.emailToValidateInfo
  );
  const showAlert = action.showAlert;
  try {
    const { email_id } = action.emailToValidateInfo;

    const response = yield call(sendEmailCodeApi, encodeURIComponent(email_id));
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
        console.warn("entro");
        goToVerify = true;
      } else {
        Swal.fire({
          type: "error",
          title: "Oops...",
          text: `${response.data.error.message}`
        });
      }
    } else {
      emailToValidateInfo = response.data;
      goToVerify = true;
    }

    if (goToHome) {
      history.push(`${process.env.PUBLIC_URL}/`);
    }
    yield put({
      type: SEND_EMAIL_CODE_FINISHED,
      emailToValidateInfo
    });
    if (goToVerify) {
      history.push(`${process.env.PUBLIC_URL}/correo/verificar`);
    }
  } catch (error) {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: `No se pudo realizar la acción, inténtelo más tarde`
    });
    yield put({
      type: SEND_EMAIL_CODE_FINISHED,
      emailToValidateInfo
    });
  }
}

export function* handleEmailValidateCode(action) {
  let emailToValidateInfo = yield select(
    state => state.email.emailToValidateInfo
  );
  try {
    const { email_id } = emailToValidateInfo;

    const response = yield call(
      validateEmailCodeApi,
      encodeURIComponent(email_id),
      action.codeEmail
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
        title: "Email validado",
        text: "El correo fue validado satisfactoriamente!"
      });
      emailToValidateInfo = response.data;
      history.push(`${process.env.PUBLIC_URL}/`);
    }

    yield put({
      type: VALIDATE_EMAIL_CODE_FINISHED,
      emailToValidateInfo
    });
    //  history.push("/correo/confirmar");
  } catch (error) {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: `No se pudo realizar la acción, inténtelo más tarde`
    });
    yield put({
      type: VALIDATE_EMAIL_CODE_FINISHED,
      emailToValidateInfo
    });
  }
}

export function* handleEmailDelete(action) {
  try {
    const response = yield call(
      deleteEmailApi,
      encodeURIComponent(action.email_id)
    );

    if (response.data.error) {
      yield put({
        type: SHOW_MESSAGE,
        errorMessage: response.data.error.message
      });
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: `No se pudo realizar la acción, inténtelo más tarde`
      });
      console.log("error2 ");
      console.log(response.data.error);
    } else {
      Swal.fire("Eliminado!", "El correo fue eliminado", "success");
    }

    yield put({
      type: DELETE_EMAIL_FINISHED
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
      type: DELETE_EMAIL_FINISHED
    });
    history.push(`${process.env.PUBLIC_URL}/`);
    console.log("error");
    console.log(error);
  }
}
