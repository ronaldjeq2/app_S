import { PLACES_LIST_REQUEST, PLACES_LIST_REQUEST_SUCCESS, PLACE_SELECTED } from "../actions/places";

const initialState = {
    placesList: [],
    placeSelected: {},
    isLoading: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PLACES_LIST_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case PLACES_LIST_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                placesList: action.placesList
            };

        case PLACE_SELECTED:
            return {
                ...state,
                placeSelected: action.placeSelected,
            };
        default:
            return state;
    }
};

export default reducer;
