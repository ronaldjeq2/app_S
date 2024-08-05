export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_REQUEST_SUCCESS = "LOGIN_REQUEST_SUCCESS";
export const LOGIN_REQUEST_ERROR = "LOGIN_REQUEST_ERROR";

export const GET_STORED_TOKEN = "GET_STORED_TOKEN";
export const TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const loginRequest = (username, password) => ({
  type: LOGIN_REQUEST,
  username,
  password
});

export const loginRequestSuccess = token => ({
  type: LOGIN_REQUEST_SUCCESS,
  token
});

export const loginRequestError = errorMessage => ({
  type: LOGIN_REQUEST_ERROR,
  errorMessage
});

export const getStoredToken = () => ({
  type: GET_STORED_TOKEN,
  token: localStorage.getItem("userToken")
});

export const tokenNotFound = () => ({
  type: TOKEN_NOT_FOUND
});

export const logoutRequest = () => {
  localStorage.removeItem("userToken");
  return { type: LOGOUT_REQUEST };
};
