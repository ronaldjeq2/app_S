import {
  GET_LIST_EMAILS,
  GET_LIST_EMAILS_SUCCESS,
  ADD_EMAIL,
  ADD_EMAIL_FINISHED,
  SEND_EMAIL_CODE,
  SEND_EMAIL_CODE_FINISHED,
  VALIDATE_EMAIL_CODE,
  VALIDATE_EMAIL_CODE_FINISHED,
  DELETE_EMAIL,
  DELETE_EMAIL_FINISHED,
  GET_LIST_TYPES_EMAILS,
  GET_LIST_TYPES_EMAILS_SUCCESS
} from "../actions/email";

const initialState = {
  emailList: [],
  typeEmailList: [],
  isLoading: false,
  isValidating: false,
  isRemoving: false,
  isLoadingList: false,
  emailToValidateInfo: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST_EMAILS:
      return {
        ...state,
        isLoading: true
      };
    case GET_LIST_EMAILS_SUCCESS:
      return {
        ...state,
        emailList: action.emailList,
        isLoading: false
      };

    case GET_LIST_TYPES_EMAILS:
      return {
        ...state,
        isLoadingList: true
      };
    case GET_LIST_TYPES_EMAILS_SUCCESS:
      return {
        ...state,
        typeEmailList: action.typeEmailList,
        isLoadingList: false
      };

    case ADD_EMAIL:
      return {
        ...state,
        isValidating: true
      };
    case ADD_EMAIL_FINISHED:
      return {
        ...state,
        isValidating: false
      };
    case SEND_EMAIL_CODE:
      return {
        ...state,
        isValidating: true,
        emailToValidateInfo: action.emailToValidateInfo
      };
    case SEND_EMAIL_CODE_FINISHED:
      return {
        ...state,
        emailToValidateInfo: action.emailToValidateInfo,
        isValidating: false
      };
    case VALIDATE_EMAIL_CODE:
      return {
        ...state,
        isValidating: true
      };
    case VALIDATE_EMAIL_CODE_FINISHED:
      return {
        ...state,
        isValidating: false,
        emailToValidateInfo: action.emailToValidateInfo
      };
    case DELETE_EMAIL:
      return {
        ...state,
        isRemoving: true
      };
    case DELETE_EMAIL_FINISHED:
      return {
        ...state,
        isRemoving: false
      };
    default:
      return state;
  }
};

export default reducer;
