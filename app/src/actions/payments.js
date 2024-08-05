export const PAYMENTS_REQUEST = "PAYMENTS_REQUEST";
export const PAYMENTS_SUCCESS = "PAYMENTS_SUCCESS";

export const PAYMENTS_DETAIL_REQUEST = "PAYMENTS_DETAIL_REQUEST";
export const PAYMENTS_DETAIL_SUCCESS = "PAYMENTS_DETAIL_SUCCESS";
export const PAYMENTS_CHANGEP_PERIOD = "PAYMENTS_CHANGEP_PERIOD";
export const RESET_DATA = "RESET_DATA";
export const CHANGE_BANK_SELECTED = "CHANGE_BANK_SELECTED";
export const PAYMENT_ERROR = "PAYMENT_ERROR";
export const paymetsRequest = () => ( {
    type: PAYMENTS_REQUEST,
} );

export const paymentsSuccess = () => ( {
    type: PAYMENTS_SUCCESS,
} );

export const paymentsDetailRequest = () => ( {
    type: PAYMENTS_DETAIL_REQUEST,
} );

export const paymentsDetailSuccess = () => ( {
    type: PAYMENTS_DETAIL_SUCCESS,
} );

export const paymentChangePeriod = termSelected => ( {
    type: PAYMENTS_CHANGEP_PERIOD,
    termSelected,
} );

export const changeBankSlected = ( bankSelected, detailBank ) => ( {
    type: CHANGE_BANK_SELECTED,
    bankSelected,
    detailBank,
} );

export const paymentError = () => ( {
    type: PAYMENT_ERROR,
} );

export const resetData = () => ( {
    type: RESET_DATA,
} );
