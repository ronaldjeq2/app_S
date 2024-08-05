export const GET_LIST_PHONES = "GET_LIST_PHONES";
export const GET_LIST_PHONES_SUCCESS = "GET_LIST_PHONES_SUCCESS";
export const ADD_PHONE = "ADD_PHONE";
export const ADD_PHONE_FINISHED = "ADD_PHONE_FINISHED";
export const SEND_PHONE_CODE = "SEND_PHONE_CODE";
export const SEND_PHONE_CODE_FINISHED = "SEND_PHONE_CODE_FINISHED";
export const VALIDATE_PHONE_CODE = "VALIDATE_PHONE_CODE";
export const VALIDATE_PHONE_CODE_FINISHED = "VALIDATE_PHONE_CODE_FINISHED";
export const DELETE_PHONE = "DELETE_PHONE";
export const DELETE_PHONE_FINISHED = "DELETE_PHONE_FINISHED";
export const getListPhones = () => ({
  type: GET_LIST_PHONES
});
export const getListPhonesSuccess = phoneList => ({
  type: GET_LIST_PHONES_SUCCESS,
  phoneList
});

export const addPhone = phone => ({
  type: ADD_PHONE,
  phone
});

export const addPhoneFinished = () => ({
  type: ADD_PHONE_FINISHED
});

export const sendPhoneCode = (phoneToValidateInfo, showAlert) => ({
  type: SEND_PHONE_CODE,
  phoneToValidateInfo,
  showAlert
});

export const sendPhoneCodeFinished = phoneToValidateInfo => ({
  type: SEND_PHONE_CODE_FINISHED,
  phoneToValidateInfo
});

export const validatePhoneCode = PhoneCode => ({
  type: VALIDATE_PHONE_CODE,
  PhoneCode
});

export const validatePhoneCodeFinished = phoneToValidateInfo => ({
  type: VALIDATE_PHONE_CODE_FINISHED,
  phoneToValidateInfo
});

export const deletePhone = phone_id => ({
  type: DELETE_PHONE,
  phone_id
});

export const deletePhoneFinished = () => ({
  type: DELETE_PHONE_FINISHED
});
