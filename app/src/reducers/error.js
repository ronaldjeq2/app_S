import { NO_ERROR, ERROR_EXIST, ERROR_DETAIL } from "../actions/error";

const initialState = {
    hasError: false,
    errorColor: null,
    errorDescription: {},
    errorStatus: 0,
    error_Message: null,
    dataExist: false,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case ERROR_EXIST:
        return {
            ...state,
            hasError: true,
            errorDescription: action.errorDescription,
            errorStatus: action.errorStatus,
            dataExist: action.dataExist,
        };
    case NO_ERROR:
        return {
            ...initialState,
        };

    case ERROR_DETAIL:
        return {
            ...state,
            errorColor: action.errorColor,
            error_Message: action.error_Message,
        };
    default:
        return state;
    }
};

export default reducer;
