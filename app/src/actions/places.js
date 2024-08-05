export const PLACES_LIST_REQUEST = "PLACES_LIST_REQUEST";
export const PLACES_LIST_REQUEST_SUCCESS = "PLACES_LIST_REQUEST_SUCCESS";
export const PLACE_SELECTED = "PLACE_SELECTED";

export const placesListRequest = () => ({
    type: PLACES_LIST_REQUEST,
});
export const placesListRequestSuccess = (listPlaces) => ({
    type: PLACES_LIST_REQUEST_SUCCESS,
    listPlaces
});
export const placeSelected = (placeSelected) => ({
    type: PLACE_SELECTED,
    placeSelected
});
