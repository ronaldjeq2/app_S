import {
    APP_VERSION_REQUEST,
    APP_VERSION_SUCCESS,
    APP_VERSION_CHECK,
    APP_VERSION_CHECK_SUCCESS,
} from "../actions/versionApp";

const initialState = {
    hasloaded: false,
    checkVersion: false,
    forceUpdate: false,
    sugestUpdate: false,
    versionDetail: {},
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case APP_VERSION_REQUEST:
        return {
            ...state,
            hasloaded: false,
        };
    case APP_VERSION_SUCCESS:
        return {
            ...state,
            versionDetail: action.versionDetail,
            hasloaded: true,
        };
    case APP_VERSION_CHECK:
        return {
            ...state,
            checkVersion: false,
        };
    case APP_VERSION_CHECK_SUCCESS:
        return {
            ...state,
            forceUpdate: action.forceUpdate,
            sugestUpdate: action.sugestUpdate,
            checkVersion: true,
        };
    default:
        return state;
    }
};

export default reducer;
