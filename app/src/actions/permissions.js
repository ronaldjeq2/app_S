export const PERMISSION_INITIAL_REQUEST = "PERMISSION_INITIAL_REQUEST";
export const PERMISSION_UPDATE_CURRENT_STATE = "PERMISSION_UPDATE_CURRENT_STATE";

export const PERMISSION_TOGGLE = "PERMISSION_TOGGLE";

export const PERMISSION_UPDATE_SUBSCRIPTION_STATE = "PERMISSION_UPDATE_SUBSCRIPTION_STATE";
export const PERMISSION_UPDATE_SHARED_LOCATION_STATE = "PERMISSION_UPDATE_SHARED_LOCATION_STATE";

export const permissionInitialRequestAction = () => ( {
    type: PERMISSION_INITIAL_REQUEST,
} );

export const permissionUpdateCurrentState = () => ( {
    type: PERMISSION_UPDATE_CURRENT_STATE,
} );

export const permissionUpdateSubscriptionState = () => ( {
    type: PERMISSION_UPDATE_SUBSCRIPTION_STATE,
} );

export const permissionUpdateLocationSharedState = () => ( {
    type: PERMISSION_UPDATE_SHARED_LOCATION_STATE,
} );

export const permissionToggleAction = permissionName => ( {
    type: PERMISSION_TOGGLE,
    permissionName,
} );
