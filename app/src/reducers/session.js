import {
    LOGIN_REQUEST,
    LOGIN_REQUEST_SUCCESS,
    LOGIN_REQUEST_ERROR,
    LOGOUT_REQUEST,
    AUTH_LOADER_MESSAGE,
    REFRESH_WALK,
} from "../actions/session";

const initialState = {
    token: null,
    isFetching: false,
    isValid: false,
    isExpired: false,
    hasError: false,
    errorMessage: null,
    message: null,
    versionWalk: null,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case LOGIN_REQUEST:
        return {
            ...state,
            isFetching: true,
            isValid: false,
            isExpired: false,
            hasError: false,
            errorMessage: null,
        };
    case LOGIN_REQUEST_SUCCESS:
        return {
            ...state,
            token: action.token,
            isFetching: false,
            isValid: true,
            isExpired: false,
            hasError: false,
            errorMessage: null,
        };
    case LOGIN_REQUEST_ERROR:
        return {
            ...state,
            token: null,
            isFetching: false,
            isValid: false,
            hasError: true,
            errorMessage: action.errorMessage,
        };
    case AUTH_LOADER_MESSAGE:
        return {
            ...state,
            message: action.message,
        };
    case LOGOUT_REQUEST:
        return {
            ...initialState,
        };
    case REFRESH_WALK:
        return {
            ...state,
            versionWalk: action.versionWalk,
        };
    default:
        return state;
    }
};

export default reducer;
