export const ACCOUNT_REQUEST_INFO = "ACCOUNT_REQUEST_INFO";
export const ACCOUNT_REQUEST_INFO_SUCCESS = "ACCOUNT_REQUEST_INFO_SUCCESS";

export const accountRequestInfoAction = () => ({
  type: ACCOUNT_REQUEST_INFO
});
export const accountRequestInfoSuccessAction = userInfo => ({
  type: ACCOUNT_REQUEST_INFO_SUCCESS,
  userInfo
});
