import { SHOW_MESSAGE, HIDE_MESSAGE } from "../actions/error";

const initialState = {
  errorMessage: "",
  showMessageError: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      return {
        ...state,
        errorMessage: action.errorMessage,
        showMessageError: true
      };
    case HIDE_MESSAGE:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

export default reducer;
