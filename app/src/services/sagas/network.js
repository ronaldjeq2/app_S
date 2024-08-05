import { put, select } from "redux-saga/effects";

import { UPDATE_CONNECTION_STATUS } from "../../actions/network";
import { NO_ERROR } from "../../actions/error";

export function* handleNetworkChangeAction( action ) {
    let connected = true;
    yield put( { type: NO_ERROR } );

    if ( action.status.toLowerCase() === "none" ) {
        connected = false;
    }
    yield put( { type: UPDATE_CONNECTION_STATUS, connected } );
}
