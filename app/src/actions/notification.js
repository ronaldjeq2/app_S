export const NOTIFICATION_SEND_TOKEN = "NOTIFICATION_SEND_TOKEN";
export const NOTIFICATION_SEND_TOKEN_SUCCESS = "NOTIFICATION_SEND_TOKEN_SUCCESS";

export const NOTIFICATION_SYNC_TAGS = "NOTIFICATION_SYNC_TAGS";
export const NOTIFICATION_SYNC_TAGS_SUCCESS = "NOTIFICATION_SYNC_TAGS_SUCCESS";

export const GET_NOTIFICATION_LIST = "GET_NOTIFICATION_LIST";
export const GET_NOTIFICATION_LIST_SUCCESS = "GET_NOTIFICATION_LIST_SUCCESS";

export const CHANGE_STATUS_NOTIFICATION = "CHANGE_STATUS_NOTIFICATION";
export const UPDATED_NOTIFICATION = "UPDATED_NOTIFICATION";
export const DISABLE_ALL_NOTIFICATIONS = "DISABLE_ALL_NOTIFICATIONS";
export const ENABLE_ALL_NOTIFICATIONS = "ENABLE_ALL_NOTIFICATIONS";

export const getNotificationList = () => ( {
    type: GET_NOTIFICATION_LIST,
} );

export const getNotificationListSuccess = notificationList => ( {
    type: GET_NOTIFICATION_LIST_SUCCESS,
    notificationList,
} );

export const changeStatusNotification = notificationInfo => ( {
    type: CHANGE_STATUS_NOTIFICATION,
    notificationInfo,
} );

export const updatedNotification = notificationList => ( {
    type: UPDATED_NOTIFICATION,
    notificationList,
} );

export const sendTokenAction = () => ( {
    type: NOTIFICATION_SEND_TOKEN,
} );

export const sendTokenSuccessAction = token => ( {
    type: NOTIFICATION_SEND_TOKEN_SUCCESS,
    token,
} );

export const syncTagsAction = tags => ( {
    type: NOTIFICATION_SYNC_TAGS,
    tags,
} );

export const syncTagsSuccessAction = ( tags, syncDate ) => ( {
    type: NOTIFICATION_SYNC_TAGS_SUCCESS,
    syncDate,
    tags,
} );

export const enableAllNotifications = () => ( {
    type: ENABLE_ALL_NOTIFICATIONS,
} );
export const disableAllNotifications = () => ( {
    type: DISABLE_ALL_NOTIFICATIONS,
} );
