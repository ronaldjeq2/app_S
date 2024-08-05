import { put, call, select } from "redux-saga/effects";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import { NEWSLIST_SUCCES, NEWSDETAILS_SUCCES, NEWSDETAILRESET } from "../../actions/news";

import API from "../api";
import { ERROR_EXIST, NO_ERROR } from "../../actions/error";

// SERVICIO PARA INGRESAR AL LISTADO DE LAS NOTICIAS
const NewsListViewservice = ( token, url ) => API( {
    url: `/news/getList/${ url }`,
    method: "GET",
    headers: { Authorization: `Bearer ${ token }` },
} );

// SERVICIO PARA OBTENER EL DETALLE DE LA NOTICIA
const NewsItemViewservice = ( accessToken, hrefnews ) => API( {
    url: "/news/get",
    method: "POST",
    data: { href: hrefnews },
    headers: { Authorization: `Bearer ${ accessToken }` },
} );

export function* handlenNewsListRequestAction( action ) {
    firebase.crashlytics().log("Iniciando la funcion handlenNewsListRequestAction " )

    //Crashlytics.log( "Iniciando la funcion handlenNewsListRequestAction " );
    TOKEN = yield select( state => state.session.token );
    try {
        const callService = action.typeRequest === "LIST" ? NewsListViewservice : NewsItemViewservice;
        firebase.crashlytics().log(`Iniciando  el llamado a ${ callService }  ` )

        //   Crashlytics.log( `Iniciando  el llamado a ${ callService }  ` );

        const response = yield call( callService, TOKEN, action.url );
        if ( response.status === 200 ) {
            const data = response.data;
            if ( action.typeRequest === "LIST" ) {
                yield put( { type: NEWSLIST_SUCCES, newsList: data } );
            }
            else {
                yield put( { type: NEWSDETAILS_SUCCES, detailNew: data } );
            }
            yield put( { type: NO_ERROR } );
            firebase.crashlytics().log("operación exitosa ")

         //   Crashlytics.log( "operación exitosa " );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorDescription: response.data.error,
                dataExist: false,
                errorStatus: 0,
            } );
        }
    }
    catch ( error ) {
        if ( error.response === undefined ) {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.request.status,
                errorDescription: error,
                dataExist: false,
            } );
        }
        else {
            yield put( {
                type: ERROR_EXIST,
                errorStatus: error.response.data.statusCode,
                errorDescription: error,
                dataExist: false,
            } );
        }
    }
}
