import {
  ACCOUNT_REQUEST_INFO,
  ACCOUNT_REQUEST_INFO_SUCCESS
} from "../actions/user";

const initialState = {
  id: null,
  pidm: null,
  isLoading: false,
  docType: null,
  numDoc: null,
  firstName: null,
  middleName: null,
  lastName: null,
  existError: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNT_REQUEST_INFO:
      return {
        ...state,
        isLoading: true
      };
    case ACCOUNT_REQUEST_INFO_SUCCESS:
      return {
        ...state,
        ...action.userInfo,
        isLoading: false,
        existError: action.existError
      };
    default:
      return state;
  }
};

export default reducer;
