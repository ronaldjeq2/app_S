export const ERROR_EXIST = "ERROR_EXIST";
export const NO_ERROR = "NO_ERROR";
export const ERROR_DETAIL = "ERROR_DETAIL";

export const errorExist = ( errorStatus, errorDescription, dataExist ) => ( {
    type: ERROR_EXIST,
    errorStatus,
    errorDescription,
    dataExist,
} );
export const noError = () => ( {
    type: NO_ERROR,
} );
export const errorDetail = ( errorColor, error_Message ) => ( {
    type: ERROR_DETAIL,
    errorColor,
    error_Message,
} );
