import React, { Component } from "react";
import { View, Linking } from "react-native";
//import { Crashlytics, Answers } from "react-native-fabric";
import firebase from 'react-native-firebase';

import { IconButton } from "../../components/Buttons";
import { Errortext } from "../../components/Error";

import styles from "./styles";

export default class HomeLinksScreen extends Component {
    componentDidMount() {
        firebase.crashlytics().log("Componente HomeLinksScreen fue montado")

      //  Crashlytics.setString( "componentDidMount", "HomeLinksScreen" );
    }

    onFacebookClick = () => {
        firebase.crashlytics().log("click_facebook" )
        firebase.analytics().setCurrentScreen("click_facebook", "link")

      //  Crashlytics.log( "click_facebook" );
      //  Answers.logContentView( "click_facebook", "link" );
        const FANPAGE_ID = "200185966800232";
        const FANPAGE_URL_FOR_APP = `fb://page/${ FANPAGE_ID }`;
        const FANPAGE_URL_FOR_BROWSER = `https://fb.com/${ FANPAGE_ID }`;

        Linking.canOpenURL( FANPAGE_URL_FOR_APP )
            .then( ( supported ) => {
                if ( !supported ) {
                    Linking.openURL( FANPAGE_URL_FOR_BROWSER );
                }
                else {
                    Linking.openURL( FANPAGE_URL_FOR_APP );
                }
            } )
            .catch( err => console.error( "An error occurred", err ) );
    };

    onYoutubeClick = () => {
        firebase.crashlytics().log("click_youtube" )
        firebase.analytics().setCurrentScreen( "click_youtube", "link" )

       // Crashlytics.log( "click_youtube" );
       // Answers.logContentView( "click_youtube", "link" );
        const CHANNEL_URL_FOR_APP = "vnd.youtube://user/virtualsenati";
        const CHANNEL_URL_FOR_BROWSER = "https://www.youtube.com/user/virtualsenati";

        Linking.canOpenURL( CHANNEL_URL_FOR_APP )
            .then( ( supported ) => {
                if ( !supported ) {
                    Linking.openURL( CHANNEL_URL_FOR_BROWSER );
                }
                else {
                    Linking.openURL( CHANNEL_URL_FOR_APP );
                }
            } )
            .catch( err => console.error( "An error occurred", err ) );
    };

    onWebOficial = () => {
        firebase.crashlytics().log("click_webOficial" )
        firebase.analytics().setCurrentScreen( "click_webOficial", "link" )
       // Crashlytics.log( "click_webOficial" );
       // Answers.logContentView( "click_webOficial", "link" );
        Linking.openURL( "http://www.senati.edu.pe" );
    };

    onAulaVirtual = () => {
        firebase.crashlytics().log("click_aulaVirtual" )
        firebase.analytics().setCurrentScreen( "click_aulaVirtual", "link"  )
      //  Crashlytics.log( "click_aulaVirtual" );
       // Answers.logContentView( "click_aulaVirtual", "link" );
        Linking.openURL( "http://aulavirtual.senati.edu.pe" );
    };

    onBiblioteca = () => {
        firebase.crashlytics().log("click_biblioteca" )
        firebase.analytics().setCurrentScreen( "click_biblioteca", "link"  )
      //  Crashlytics.log( "click_biblioteca" );
      //  Answers.logContentView( "click_biblioteca", "link" );
        Linking.openURL( "https://senatipe.sharepoint.com/sites/innovacion/bv" );
    };

    onNews = () => {
        firebase.crashlytics().log("click_news" )
        firebase.analytics().setCurrentScreen( "click_news", "link"  )
       // Crashlytics.log( "click_news" );
       // Answers.logContentView( "click_news", "link" );
        this.props.navigation.navigate( "News" );
    };

    render() {
        return (
            <View style={ { flex: 1 } }>
                <Errortext lastUpdated="" />
                <View style={ styles.container }>
                    <IconButton
                        onPress={ this.onWebOficial }
                        text=" Web Oficial"
                        icon={ require( "./icons/web.png" ) }
                    />
                    <IconButton
                        onPress={ this.onFacebookClick }
                        text="Facebook"
                        icon={ require( "./icons/facebook.png" ) }
                    />
                    <IconButton
                        onPress={ this.onYoutubeClick }
                        text="Youtube"
                        icon={ require( "./icons/youtube.png" ) }
                    />
                    <IconButton
                        onPress={ this.onAulaVirtual }
                        text="Aula Virtual"
                        icon={ require( "./icons/aula-virtual.png" ) }
                    />
                    <IconButton
                        onPress={ this.onBiblioteca }
                        text="Biblioteca"
                        icon={ require( "./icons/biblioteca.png" ) }
                    />
                    <IconButton
                        onPress={ this.onNews }
                        text="Noticias"
                        icon={ require( "./icons/news.png" ) }
                    />
                </View>
            </View>
        );
    }
}
