import {
    NOTIFICATION_SEND_TOKEN,
    NOTIFICATION_SEND_TOKEN_SUCCESS,
    NOTIFICATION_SYNC_TAGS,
    NOTIFICATION_SYNC_TAGS_SUCCESS,
    CHANGE_STATUS_NOTIFICATION,
    UPDATED_NOTIFICATION,
    DISABLE_ALL_NOTIFICATIONS,
    ENABLE_ALL_NOTIFICATIONS,
    GET_NOTIFICATION_LIST,
    GET_NOTIFICATION_LIST_SUCCESS,
} from "../actions/notification";

const initialState = {
    token: null,
    hasSentToken: false,
    lastSynced: null, // date
    tags: {},
    store: [],
    notificationList: {
        general: {
            name: "Generales",
            isActive: false,
        },
        notes: {
            name: "Notas",
            isActive: false,
        },
        certificates: {
            name: "Certificados y títulos",
            isActive: false,
        },
        payments: {
            name: "Pagos y martrículas",
            isActive: false,
        },
        events: {
            name: "Eventos",
            isActive: false,
        },
    },
    allNotificationIsActive: false,
    changeStatusNotificationIsFinished: false,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case GET_NOTIFICATION_LIST_SUCCESS:
        return {
            ...state,
            store: action.notificationList,
        };
    case NOTIFICATION_SEND_TOKEN:
        return {
            ...state,
        };
    case NOTIFICATION_SEND_TOKEN_SUCCESS:
        return {
            ...state,
            token: action.token,
            hasSentToken: true,
        };
    case NOTIFICATION_SYNC_TAGS:
        return {
            ...state,
        };
    case NOTIFICATION_SYNC_TAGS_SUCCESS:
        return {
            ...state,
            lastSynced: action.syncDate,
            tags: action.tags,
        };
    case CHANGE_STATUS_NOTIFICATION:
        return {
            ...state,
            changeStatusNotificationIsFinished: false,
        };
    case UPDATED_NOTIFICATION:
        return {
            ...state,
            notificationList: action.notificationList,
            allNotificationIsActive: action.allNotificationIsActive,
            changeStatusNotificationIsFinished: true,
        };
    case DISABLE_ALL_NOTIFICATIONS:
        return {
            ...state,
            allNotificationIsActive: false,
            notificationList: {
                general: {
                    name: "Generales",
                    isActive: false,
                },
                notes: {
                    name: "Notas",
                    isActive: false,
                },
                certificates: {
                    name: "Certificados y títulos",
                    isActive: false,
                },
                payments: {
                    name: "Pagos y martrículas",
                    isActive: false,
                },
                events: {
                    name: "Eventos",
                    isActive: false,
                },
            },
        };
    case ENABLE_ALL_NOTIFICATIONS:
        return {
            ...state,
            allNotificationIsActive: true,
            notificationList: {
                general: {
                    name: "Generales",
                    isActive: true,
                },
                notes: {
                    name: "Notas",
                    isActive: true,
                },
                certificates: {
                    name: "Certificados y títulos",
                    isActive: true,
                },
                payments: {
                    name: "Pagos y martrículas",
                    isActive: true,
                },
                events: {
                    name: "Eventos",
                    isActive: true,
                },
            },
        };
    default:
        return state;
    }
};

export default reducer;
