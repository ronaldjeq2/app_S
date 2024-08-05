import { CHANGE_CONNECTION_STATUS, UPDATE_CONNECTION_STATUS } from "../actions/network";

const initialState = {
    connected: true,
    hasCheckdStatus: false,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case CHANGE_CONNECTION_STATUS:
        return {
            ...state,
        };
    case UPDATE_CONNECTION_STATUS:
        return {
            ...state,
            hasCheckdStatus: true,
            connected: action.connected,
        };
    default:
        return state;
    }
};

export default reducer;
