export const GET_LIST_EMAILS = "GET_LIST_EMAILS";
export const GET_LIST_EMAILS_SUCCESS = "GET_LIST_EMAILS_SUCCESS";
export const GET_LIST_TYPES_EMAILS = "GET_LIST_TYPES_EMAILS";
export const GET_LIST_TYPES_EMAILS_SUCCESS = "GET_LIST_TYPES_EMAILS_SUCCESS";
export const ADD_EMAIL = "ADD_EMAIL";
export const ADD_EMAIL_FINISHED = "ADD_EMAIL_FINISHED";
export const SEND_EMAIL_CODE = "SEND_EMAIL_CODE";
export const SEND_EMAIL_CODE_FINISHED = "SEND_EMAIL_CODE_FINISHED";
export const ACTIVE_RE_SEND_CODE = "ACTIVE_RE_SEND_CODE";
export const VALIDATE_EMAIL_CODE = "VALIDATE_EMAIL_CODE";
export const VALIDATE_EMAIL_CODE_FINISHED = "VALIDATE_EMAIL_CODE_FINISHED";
export const DELETE_EMAIL = "DELETE_EMAIL";
export const DELETE_EMAIL_FINISHED = "DELETE_EMAIL_FINISHED";

export const getListEmail = () => ({
  type: GET_LIST_EMAILS
});
export const getListEmailSuccess = emailList => ({
  type: GET_LIST_EMAILS_SUCCESS,
  emailList
});
export const getListTypesEmail = () => ({
  type: GET_LIST_TYPES_EMAILS
});
export const getListTypesEmailSuccess = typeEmailList => ({
  type: GET_LIST_TYPES_EMAILS_SUCCESS,
  typeEmailList
});
export const addEmail = (email, typeEmail) => ({
  type: ADD_EMAIL,
  email,
  typeEmail
});

export const addEmailFinished = () => ({
  type: ADD_EMAIL_FINISHED
});

export const sendEmailCode = (emailToValidateInfo, showAlert) => ({
  type: SEND_EMAIL_CODE,
  emailToValidateInfo,
  showAlert
});

export const sendEmailCodeFinished = emailToValidateInfo => ({
  type: SEND_EMAIL_CODE_FINISHED,
  emailToValidateInfo
});

export const validateEmailCode = codeEmail => ({
  type: VALIDATE_EMAIL_CODE,
  codeEmail
});

export const validateEmailCodeFinished = emailToValidateInfo => ({
  type: VALIDATE_EMAIL_CODE_FINISHED,
  emailToValidateInfo
});

export const deleteEmail = email_id => ({
  type: DELETE_EMAIL,
  email_id
});

export const deleteEmailFinished = () => ({
  type: DELETE_EMAIL_FINISHED
});
