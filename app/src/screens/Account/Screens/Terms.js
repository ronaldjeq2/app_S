import React from "react";
import { WebView } from 'react-native-webview';
import { colors } from "../../../config/styles";
import { Gears } from "../../../components/Loading";

/*
    TODO:
    [x] Load a webview for http://www.senati.edu.pe/noticias-y-eventos
    [ ] Shows loader until web is fully loaded
    [ ] Remove Header of the web via js
    [ ] Remove breadcrumb 'Inicio / noticias eventos'
    [ ] Add buttons for goBack, goForward and close
    [ ] Handle the hardwareBackButton to goBack in pages
 */

const Terms = () => (
    <WebView
        style={ { backgroundColor: colors.$white } }
        source={ { uri: "http://www.senati.edu.pe/privacidad-y-uso-de-datos" } }
        startInLoadingState
        renderLoading={ () => <Gears message="Cargando información ..." /> }
    />
);

export default Terms;
