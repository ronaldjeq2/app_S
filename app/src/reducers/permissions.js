import {
    PERMISSION_INITIAL_REQUEST,
    PERMISSION_UPDATE_SUBSCRIPTION_STATE,
    PERMISSION_UPDATE_SHARED_LOCATION_STATE,
} from "../actions/permissions";

/**
 * Permissions states by react-native-permission module
 * https://github.com/yonahforst/react-native-permissions
 *
 * === 'authorized' ===
 * User has authorized this permission
 *
 * === 'denied' ===
 * User has denied this permission at least once.
 * On iOS this means that the user will not be prompted again.
 * Android users can be prompted multiple times until they select 'Never ask me again'
 *
 * ==== 'restricted' ===
 * iOS - this means user is not able to grant this permission, either because
 * it's not supported by the device or because it has been blocked by parental controls.
 * Android - this means that the user has selected 'Never ask me again' while denying permission
 *
 * ==== 'undetermined' ====
 * User has not yet been prompted with a permission dialog
 */

const initialState = {
    locationShared: {
        nativeState: "undetermined",
        enabled: false,
    },
    subscriptionState: {
        nativeState: "undetermined", // native permission
        notificationsEnabled: false,
        pushToken: null,
        subscriptionEnabled: false,
        userId: null,
        userSubscriptionEnabled: false, // oneSignal state,
    },
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case PERMISSION_INITIAL_REQUEST:
        return {
            ...state,
        };
    case PERMISSION_UPDATE_SUBSCRIPTION_STATE:
        return {
            ...state,
            subscriptionState: action.subscriptionState,
        };
    case PERMISSION_UPDATE_SHARED_LOCATION_STATE:
        return {
            ...state,
            locationShared: action.locationShared,
        };
    default:
        return state;
    }
};

export default reducer;
