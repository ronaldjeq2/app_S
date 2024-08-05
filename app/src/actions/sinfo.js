export const SINFO_REQUEST = "SINFO_REQUEST";
export const SINFO_REQUEST_SUCCESS = "SINFO_REQUEST_SUCCESS";
export const SINFO_REQUEST_ERROR = "SINFO_REQUEST_ERROR";
export const SINFO_LOGOUT = "SINFO_LOGOUT";

export const sinfoRequest = () => ( {
    type: SINFO_REQUEST,
} );

export const sinfoRequestSuccess = ( code, uri ) => ( {
    type: SINFO_REQUEST_SUCCESS,
    code,
    uri,
} );

export const sinfoRequestError = errorMessage => ( {
    type: SINFO_REQUEST_ERROR,
    errorMessage,
} );

export const sinfoLogout = () => ( {
    type: SINFO_LOGOUT,
} );
