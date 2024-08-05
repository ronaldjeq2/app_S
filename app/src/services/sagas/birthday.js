import { put, call, select } from "redux-saga/effects";
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import {
    BIRTHDAY_SUCCESS,
    BIRTHDAY_SETLIST,
    BIRTHDAY_UPDATELIST,
    BIRTHDAY_EXISTLISTDAY,
} from "../../actions/birthday";
import "../../actions/session";
import API from "../api";
// import messages from "../../config/messages";
import NavigationService from "../Navigation";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";

const BirthdayViewservice = ( token, ref_date ) => API( {
    url: "/student/classmate/birthdays",
    method: "POST",
    headers: { Authorization: `Bearer ${ token }` },
    data: { ref_date },
} );

export function* handlebirthdayRequestAction( action ) {
    const TOKEN = yield select( state => state.session.token );
    firebase.crashlytics().log("Iniciando la funcion handlebirthdayRequestAction ")

   // Crashlytics.log( "Iniciando la funcion handlebirthdayRequestAction " );
    try {
        firebase.crashlytics().log("Iniciando  el llamado a BirthdayViewservice  ")

      //  Crashlytics.log( "Iniciando  el llamado a BirthdayViewservice  " );
        // Send params to server
        const response = yield call( BirthdayViewservice, TOKEN, action.ref_date );
        if ( response.status === 200 ) {
            const birthdayList = response.data;
            const lastUpdated = response.headers.date;
            yield put( { type: NO_ERROR } );
            yield put( { type: BIRTHDAY_SUCCESS, birthdayList, lastUpdated } );
            firebase.crashlytics().log("operación exitosa ")

            //   Crashlytics.log( "operación exitosa " );
        }
        else {
            const birthday = yield select( state => state.birthday.isLoadedbirthday );

            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: birthday,
                errorStatus: 0,
            } );
        }
        yield put( { type: BIRTHDAY_UPDATELIST } );
    }
    catch ( error ) {
        const birthdaydata = yield select( state => state.birthday.isLoadedbirthday );

        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: birthdaydata,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: birthdaydata,
            } );
        }
    }
}

export function* handleUpdateListAction() {
    firebase.crashlytics().log("Iniciando la funcion handleUpdateListAction " )

  //  Crashlytics.log( "Iniciando la funcion handleUpdateListAction " );
    const birthdaydata = yield select( state => state.birthday.birthdayList );
    const hashappybirthdaylist = new Array();
    const monthsbirthday = new Object();
    let existbirthdaytoday = false;
    const today = fnsFormat( new Date(), "DD/MM/YYYY", {
        locale: fnsESLocale,
    } );

    birthdaydata.map( ( itembirthday, key ) => {
        const cursorMonth = fnsFormat( itembirthday.birthdate, "MM", {
            locale: fnsESLocale,
        } );
        if ( itembirthday.birthdate_string === today ) {
            hashappybirthdaylist.push( itembirthday );
        }
        else {
            monthsbirthday[ cursorMonth ] = monthsbirthday[ cursorMonth ] || [];
            monthsbirthday[ cursorMonth ].push( itembirthday );
        }
    } );
    if ( hashappybirthdaylist.length > 0 ) {
        existbirthdaytoday = true;
    }

    yield put( {
        type: BIRTHDAY_EXISTLISTDAY,
        existbirthdaytoday,
    } );
    yield put( {
        type: BIRTHDAY_SETLIST,
        listhappybirthday: hashappybirthdaylist,
        listnothappybirthday: monthsbirthday,
    } );
}
