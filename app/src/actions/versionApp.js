export const APP_VERSION_REQUEST = "APP_VERSION_REQUEST";
export const APP_VERSION_SUCCESS = "APP_VERSION_SUCCESS";
export const APP_VERSION_CHECK = "APP_VERSION_CHECK";
export const APP_VERSION_CHECK_SUCCESS = "APP_VERSION_CHECK_SUCCESS";

export const appVersionRequest = versionApp => ( {
    type: APP_VERSION_REQUEST,
    versionApp,
} );
export const appVersionSuccess = () => ( {
    type: APP_VERSION_SUCCESS,
} );

export const appVersionCheck = () => ( {
    type: APP_VERSION_CHECK,
} );
export const appVersionCheckSuccess = () => ( {
    type: APP_VERSION_CHECK_SUCCESS,
} );
