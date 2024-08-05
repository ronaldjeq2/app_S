import {
  LOGIN_REQUEST,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_ERROR,
  LOGOUT_REQUEST,
  GET_STORED_TOKEN
} from "../actions/session";

const initialState = {
  token: null,
  isLogged: false,
  isFetching: false,
  isValid: false,
  isExpired: false,
  hasError: false,
  errorMessage: null,
  message: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLogged: false,
        isValid: false,
        isExpired: false,
        hasError: false,
        errorMessage: null
      };
    case LOGIN_REQUEST_SUCCESS:
      return {
        ...state,
        token: action.token,
        isLogged: !!action.token,
        isFetching: false,
        isValid: true,
        isExpired: false,
        hasError: false,
        errorMessage: null
      };
    case LOGIN_REQUEST_ERROR:
      return {
        ...state,
        token: null,
        isLogged: false,
        isFetching: false,
        isValid: false,
        hasError: true,
        errorMessage: action.errorMessage
      };
    case LOGOUT_REQUEST:
      return initialState;
    case GET_STORED_TOKEN:
      return {
        ...state,
        token: action.token,
        isLogged: !!action.token,
        isFetching: false,
        isValid: false,
        hasError: false,
        errorMessage: null
      };
    default:
      return state;
  }
};

export default reducer;
