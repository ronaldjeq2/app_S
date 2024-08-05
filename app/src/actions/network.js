export const CHANGE_CONNECTION_STATUS = "CHANGUE_CONNECTION_STATUS";
export const UPDATE_CONNECTION_STATUS = "UPDATE_CONNECTION_STATUS";

export const changeConnectionStatus = status => ( {
    type: CHANGE_CONNECTION_STATUS,
    status,
} );

export const updateConnectionStatus = connected => ( {
    type: UPDATE_CONNECTION_STATUS,
    connected,
} );
