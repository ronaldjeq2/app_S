import {
    PAYMENTS_DETAIL_SUCCESS,
    PAYMENTS_SUCCESS,
    PAYMENTS_DETAIL_REQUEST,
    PAYMENTS_REQUEST,
    PAYMENTS_CHANGEP_PERIOD,
    RESET_DATA,
    CHANGE_BANK_SELECTED,
    PAYMENT_ERROR,
} from "../actions/payments";

const initialState = {
    isTermLoaded: false,
    isTermDetailLoaded: false,
    termSelected: null,
    termList: {},
    lastTerm: null,
    detailLastPeriod: {},
    bankSelected: "Escoger banco favorito",
    detailBank: "Revisa la información de pagos",
    lastUpdated: null,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case PAYMENTS_REQUEST:
        return {
            ...state,
            isTermLoaded: false,
            isTermDetailLoaded: false,
        };
    case PAYMENTS_SUCCESS:
        return {
            ...state,
            termList: action.termList,
            isTermLoaded: true,
            lastUpdated: action.lastUpdated,
        };
    case PAYMENTS_DETAIL_REQUEST:
        return {
            ...state,
            isTermDetailLoaded: false,
        };
    case PAYMENTS_DETAIL_SUCCESS:
        return {
            ...state,
            termList: action.termList,
            lastTerm: action.lastTerm,
            isTermDetailLoaded: true,
            lastUpdated: action.lastUpdated,
            termSelected: action.termSelected,
        };

    case PAYMENTS_CHANGEP_PERIOD:
        return {
            ...state,
            termSelected: action.termSelected,
            isTermDetailLoaded: false,
        };

    case RESET_DATA:
        return { initialState };

    case CHANGE_BANK_SELECTED:
        return {
            ...state,
            bankSelected: action.bankSelected,
            detailBank: action.detailBank,
        };
    case PAYMENT_ERROR:
        return {
            ...state,
            isTermDetailLoaded: true,
            isTermLoaded: true,
        };
    default:
        return state;
    }
};

export default reducer;
