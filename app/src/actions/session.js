export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_REQUEST_SUCCESS = "LOGIN_REQUEST_SUCCESS";
export const LOGIN_REQUEST_ERROR = "LOGIN_REQUEST_ERROR";

export const GET_STORED_TOKEN = "GET_STORED_TOKEN";
export const TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";

export const AUTH_LOADER_MESSAGE = "AUTH_LOADER_MESSAGE";

export const WALK_WAS_SHOWN = "WALK_WAS_SHOWN";

export const loginRequest = ( username, password ) => {
    if ( !username ) {
        return {
            type: LOGIN_REQUEST_ERROR,
            errorMessage: "Ingresa tu ID de SINFO",
        };
    }
    if ( !password ) {
        return {
            type: LOGIN_REQUEST_ERROR,
            errorMessage: "Ingresa tu contraseña de SINFO",
        };
    }
    return {
        type: LOGIN_REQUEST,
        username,
        password,
    };
};

export const loginRequestSuccess = token => ( {
    type: LOGIN_REQUEST_SUCCESS,
    token,
} );

export const loginRequestError = errorMessage => ( {
    type: LOGIN_REQUEST_ERROR,
    errorMessage,
} );

export const getStoredToken = () => ( {
    type: GET_STORED_TOKEN,
} );

export const tokenNotFound = () => ( {
    type: TOKEN_NOT_FOUND,
} );

export const logoutRequest = () => ( {
    type: LOGOUT_REQUEST,
} );

export const authLoaderMessageAction = message => ( {
    type: AUTH_LOADER_MESSAGE,
    message,
} );

export const walkWasShownAction = () => ( {
    type: WALK_WAS_SHOWN,
} );
