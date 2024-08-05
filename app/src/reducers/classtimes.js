import { CLASSTIMES_SUCCESS, CLASSTIMES_REQUEST } from "../actions/classtimes";

const initialState = {
    isLoadedClass: false,
    classTimesList: {},
    existListClass: false,
    lastUpdated: null,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case CLASSTIMES_REQUEST:
        return { ...state };
    case CLASSTIMES_SUCCESS:
        return {
            ...state,
            isLoadedClass: true,
            classTimesList: action.classTimesList,
            existListClass: true,
            lastUpdated: action.lastUpdated,
        };

    default:
        return state;
    }
};

export default reducer;
