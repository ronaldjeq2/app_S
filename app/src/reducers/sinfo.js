import {
    SINFO_REQUEST,
    SINFO_REQUEST_SUCCESS,
    SINFO_REQUEST_ERROR,
    SINFO_LOGOUT,
} from "../actions/sinfo";

const initialState = {
    isFetching: false,
    code: null,
    uri: null,
    hasError: false,
    errorMessage: null,
    errorKey: null,
    errorLevel: null,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case SINFO_REQUEST:
        return {
            ...initialState,
            isFetching: true,
        };
    case SINFO_REQUEST_SUCCESS:
        return {
            ...state,
            code: action.code,
            uri: action.uri,
            isFetching: false,
            hasError: false,
            errorMessage: null,
        };
    case SINFO_REQUEST_ERROR:
        return {
            ...state,
            code: null,
            uri: null,
            isFetching: false,
            hasError: true,
            errorKey: action.errorKey,
            errorLevel: action.errorLevel,
            errorMessage: action.errorMessage,
        };
    case SINFO_LOGOUT:
        return {
            ...initialState,
        };
    default:
        return state;
    }
};

export default reducer;
