import { put, call, select } from "redux-saga/effects";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import { PAYMENTS_DETAIL_SUCCESS, PAYMENTS_SUCCESS, PAYMENT_ERROR } from "../../actions/payments";
import "../../actions/session";
import API from "../api";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";

const TermService = () => API( {
    url: "/payments/term",
    method: "GET",
} );

const TermDetailsService = periodo => API( {
    url: `/payments/term/${ periodo }/detail`,
    method: "GET",
} );

export function* handlePaymentstRequestAction( /* action */ ) {
    firebase.crashlytics().log("Iniciando la función handlePaymentstRequestAction")

   // Crashlytics.log( "Iniciando la función handlePaymentstRequestAction" );
    const TERM_LIST = yield select( state => state.payments.termList );
    const isTermLoaded = yield select( state => state.payments.isTermLoaded );
    const lastTerm = yield select( state => state.payments.lastTerm );
    const termSelected = yield select( state => state.payments.termSelected );
    const dataExist = true;

    const verifiExistData = lastTerm === null
        || TERM_LIST[ termSelected ] === undefined
        || TERM_LIST[ termSelected ].existData === false;
    try {
        firebase.crashlytics().log("Iniciando el llamado a  TermService " )

       // Crashlytics.log( "Iniciando el llamado a  TermService " );
        const response = yield call( TermService );
        if ( response.status === 200 ) {
            console.log( "console data", response.data );
            yield put( { type: NO_ERROR } );
            const termListResponse = response.data;
            const lastUpdated = response.headers.date;

            /** Delete items that not are in server response */
            Object.keys( TERM_LIST ).forEach( ( codTerm ) => {
                if ( termListResponse[ codTerm ] === undefined ) {
                    delete TERM_LIST[ codTerm ];
                }
            } );

            /** Add or Update data from server */
            Object.keys( termListResponse ).forEach( ( codTerm ) => {
                /** In case of duplicate the last value stands */
                TERM_LIST[ codTerm ] = {
                    ...TERM_LIST[ codTerm ],
                    ...termListResponse[ codTerm ],
                };
            } );

            const termList = TERM_LIST;
            yield put( { type: PAYMENTS_SUCCESS, termList, lastUpdated } );
            firebase.crashlytics().log("operación exitosa ")

          //  Crashlytics.log( "operación exitosa " );
        }
        else {
            if ( !verifiExistData ) {
                yield put( {
                    type: PAYMENT_ERROR,
                } );
            }

            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: !verifiExistData,
                errorStatus: 0,
            } );
        }
    }
    catch ( error ) {
        if ( !verifiExistData ) {
            yield put( {
                type: PAYMENT_ERROR,
            } );
        }
        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: !verifiExistData,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: !verifiExistData,
            } );
        }
    }
}

export function* handlePaymentsDetailstRequestAction( /* action */ ) {
    firebase.crashlytics().log("Iniciando la función handlePaymentsDetailstRequestAction")

//Crashlytics.log( "Iniciando la función handlePaymentsDetailstRequestAction" );

    const TERM_LIST = yield select( state => state.payments.termList );
    let lastTerm = yield select( state => state.payments.lastTerm );
    const termSelected = yield select( state => state.payments.termSelected );
    let lastDataExist;
    let verifi;
    try {
        firebase.crashlytics().log("Iniciando el llamado a  TermDetailsService " )

      //  Crashlytics.log( "Iniciando el llamado a  TermDetailsService " );
        let period = termSelected;
        verifi = period === null
            || TERM_LIST[ period ] === undefined
            || TERM_LIST[ period ].existData === undefined
            || TERM_LIST[ period ].existData === false;
        const response = yield call( TermDetailsService, period );

        if ( response.status === 200 ) {
            const detailPeriod = response.data;
            const lastUpdated = response.headers.date;

            Object.keys( TERM_LIST ).map( ( item ) => {
                lastTerm = lastTerm > item ? lastTerm : item;
            } );
            period = period === null ? lastTerm : termSelected;
            if ( TERM_LIST[ period ] !== undefined ) {
                TERM_LIST[ period ].mountTotal = detailPeriod.mountTotal;
                TERM_LIST[ period ].mountCanceled = detailPeriod.mountCanceled;
                TERM_LIST[ period ].currentPayment = detailPeriod.currentPayment;
                TERM_LIST[ period ].listPayments = detailPeriod.termDetail;
                TERM_LIST[ period ].existData = true;
            }

            const termList = TERM_LIST;
            yield put( { type: NO_ERROR } );
            yield put( {
                type: PAYMENTS_DETAIL_SUCCESS,
                termList,
                lastTerm,
                lastUpdated,
                termSelected: period,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: !verifi,
                errorStatus: 0,
            } );
            yield put( {
                type: PAYMENT_ERROR,
            } );
        }
    }
    catch ( error ) {
        if ( !verifi ) {
            yield put( {
                type: PAYMENT_ERROR,
            } );
        }
        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: !verifi,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: !verifi,
            } );
        }
    }
}
