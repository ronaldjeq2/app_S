import {
  GET_LIST_PHONES,
  GET_LIST_PHONES_SUCCESS,
  ADD_PHONE,
  ADD_PHONE_FINISHED,
  SEND_PHONE_CODE,
  SEND_PHONE_CODE_FINISHED,
  VALIDATE_PHONE_CODE,
  VALIDATE_PHONE_CODE_FINISHED,
  DELETE_PHONE,
  DELETE_PHONE_FINISHED
} from "../actions/phone";

const initialState = {
  phoneList: [],
  isLoading: false,
  isValidating: false,
  isRemoving: false,
  phoneToValidateInfo: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST_PHONES:
      return {
        ...state,
        isLoading: true
      };
    case GET_LIST_PHONES_SUCCESS:
      return {
        ...state,
        phoneList: action.phoneList,
        isLoading: false
      };
    case ADD_PHONE:
      return {
        ...state,
        isValidating: true
      };
    case ADD_PHONE_FINISHED:
      return {
        ...state,
        isValidating: false
      };
    case SEND_PHONE_CODE:
      return {
        ...state,
        isValidating: true,
        phoneToValidateInfo: action.phoneToValidateInfo
      };
    case SEND_PHONE_CODE_FINISHED:
      return {
        ...state,
        phoneToValidateInfo: action.phoneToValidateInfo,
        isValidating: false
      };
    case VALIDATE_PHONE_CODE:
      return {
        ...state,
        isValidating: true
      };
    case VALIDATE_PHONE_CODE_FINISHED:
      return {
        ...state,
        isValidating: false,
        phoneToValidateInfo: action.phoneToValidateInfo
      };

    case DELETE_PHONE:
      return {
        ...state,
        isRemoving: true
      };
    case DELETE_PHONE_FINISHED:
      return {
        ...state,
        isRemoving: false
      };

    default:
      return state;
  }
};

export default reducer;
