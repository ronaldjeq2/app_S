import { put, call } from "redux-saga/effects";
import { ACCOUNT_REQUEST_INFO_SUCCESS } from "../../actions/user";
import API from "../api";

export const requestAccountInfo = () =>
  API({
    url: "/account/info",
    method: "POST",
    data: {}
  });
export function* handleAccountRequestInfoAction(/* action */) {
  let userInfo = {};
  let existError = true;
  try {
    const response = yield call(requestAccountInfo);
    if (response.status === 200) {
      existError = false;
      userInfo = response.data;
      yield put({ type: ACCOUNT_REQUEST_INFO_SUCCESS, userInfo, existError });
    } else {
      /*       Swal.fire({
        type: "error",
        title: "Oops...",
        text: `No se pudo obtener la informacion del usuario, inténtelo más tarde`
      }); */
      yield put({ type: ACCOUNT_REQUEST_INFO_SUCCESS, userInfo, existError });
    }
  } catch (error) {
    if (error.response === undefined) {
      /*       Swal.fire({
        type: "error",
        title: "Oops...",
        text: `No se pudo obtener la informacion del usuario, inténtelo más tarde`
      }); */
    } else {
      /*       Swal.fire({
        type: "error",
        title: "Oops...",
        text: `No se pudo obtener la informacion del usuario, inténtelo más tarde`
      }); */
    }
    yield put({ type: ACCOUNT_REQUEST_INFO_SUCCESS, userInfo, existError });
  }
}
