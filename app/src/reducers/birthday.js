import {
    BIRTHDAY_SUCCESS,
    BIRTHDAY_REQUEST,
    BIRTHDAY_REQUEST_ERROR,
    BIRTHDAY_UPDATELIST,
    BIRTHDAY_SETLIST,
    BIRTHDAY_EXISTLISTDAY,
} from "../actions/birthday";

const initialState = {
    isLoadedbirthday: false,
    birthdayList: [],
    hasError: false,
    listhappybirthday: [],
    listnothappybirthday: {},
    finishlist: false,
    existbirthdaytoday: false,
    lastUpdated: null,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case BIRTHDAY_REQUEST:
        return { ...state };
    case BIRTHDAY_SUCCESS:
        return {
            ...state,
            isLoadedbirthday: true,
            birthdayList: action.birthdayList,
            lastUpdated: action.lastUpdated,
        };
    case BIRTHDAY_REQUEST_ERROR:
        return {
            ...state,
            errorMessage: action.errorMessage,
            hasError: true,
        };
    case BIRTHDAY_UPDATELIST:
        return {
            ...state,
        };
    case BIRTHDAY_SETLIST:
        return {
            ...state,
            listhappybirthday: action.listhappybirthday,
            listnothappybirthday: action.listnothappybirthday,
            finishlist: true,
        };
    case BIRTHDAY_EXISTLISTDAY:
        return {
            ...state,
            existbirthdaytoday: action.existbirthdaytoday,
        };
    default:
        return state;
    }
};

export default reducer;
