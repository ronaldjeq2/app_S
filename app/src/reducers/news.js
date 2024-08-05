import { NEWSLIST_SUCCES, NEWSLIST_REQUEST, NEWSDETAILS_SUCCES } from "../actions/news";

const initialState = {
    isLoaded: false,
    newsList: [],
    detailNew: {},
    isDetailLoaded: false,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case NEWSLIST_REQUEST:
        return {
            ...state,
            isDetailLoaded: false,
        };
    case NEWSLIST_SUCCES:
        return {
            ...state,
            isLoaded: true,
            newsList: action.newsList,
        };

    case NEWSDETAILS_SUCCES:
        return {
            ...state,
            isDetailLoaded: true,
            detailNew: action.detailNew,
        };

    default:
        return state;
    }
};

export default reducer;
