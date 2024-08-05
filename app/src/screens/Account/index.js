import React, { PureComponent } from "react";
import {
    View,
    ScrollView,
    Image,
    Text,
    Switch,
    TouchableOpacity,
    Platform,
    Linking,
    AppState,
} from "react-native";
import { connect } from "react-redux";
//import { Crashlytics, Answers } from "react-native-fabric";
import firebase from 'react-native-firebase';
import PropTypes from "prop-types";

import styles from "./styles";
import { colors, THEME } from "../../config/styles";
import { Errortext } from "../../components/Error";

import { permissionToggleAction, permissionUpdateCurrentState } from "../../actions/permissions";

/**
 * TODO:
 * [x] Make the UI
 * [ ] Separate in components
 * [*] Make the Personal Data Screen
 * [x] Make the Career Data Screen
 * [x] Read the data from storage or OneSignal for share location and notification permission
 * [x] Connect with the OneSignal SDK for Share location
 * [x] Connect with the OneSignal SDK for Push Notification Permission
 * [*] Make the app Version Screen
 * [x] Make the Terms of Use Screen
 * [x] Connect with the PlayStore and AppStore for let the user make a review
 * [x] Make works the Logout Button
 */
class Account extends PureComponent {
    static propTypes = {
        dispatch: PropTypes.func,
        isNotificationEnabled: PropTypes.bool,
        isLocationEnabled: PropTypes.bool,
        connected: PropTypes.bool,
        navigation: PropTypes.object,
        lastUpdated: PropTypes.string,
    };

    componentDidMount() {
        firebase.crashlytics().log("componentDidMount => Account" )
/*         Crashlytics.setString( "componentDidMount", "Account" );
        Crashlytics.log( "componentDidMount => Account" );*/
        AppState.addEventListener( "change", this.handleAppStateChange );
    }

    componentWillUnmount() {
        AppState.removeEventListener( "change", this.handleAppStateChange );
    }

    handleAppStateChange = () => {
        const { dispatch } = this.props;
        dispatch( permissionUpdateCurrentState() );
    };

    handleReviewLink = () => {
        if ( Platform === "ios" ) {
            Linking.openURL( "https://itunes.apple.com/pe/app/senati-m%C3%B3vil/id1358336389?mt=8" );
        }
        else {
            Linking.openURL( "https://play.google.com/store/apps/details?id=edu.senati.app" );
        }
    };

    handlePermissionToggle = ( permissionName ) => {
        const { dispatch } = this.props;
        dispatch( permissionToggleAction( permissionName ) );
    };

    detailDate( scene ) {
        const { navigation } = this.props;
        firebase.crashlytics().log( `Homescene to: ${ scene }` )
        firebase.analytics().setCurrentScreen(scene, "Account option")
       /*  Crashlytics.log( `Homescene to: ${ scene }` );
        Answers.logContentView( scene, "Account option" ); */
        return scene === "Terms" && Platform.OS === "ios"
            ? Linking.openURL( "http://www.senati.edu.pe/privacidad-y-uso-de-datos" )
            : navigation.navigate( scene );
    }

    render() {
        const { isLocationEnabled, isNotificationEnabled, connected, lastUpdated } = this.props;
        return (
            <ScrollView style={ styles.container }>
                <Errortext lastupdated={ lastUpdated } />

                {/* My Data */}
                <View style={ styles.segmentWrapper }>
                    <Text style={ styles.segmentTitle }>Mis Datos</Text>
                    <View style={ styles.optionList }>
                        <TouchableOpacity
                            style={ styles.option }
                            onPress={ () => this.detailDate( "PersonalData" ) }
                        >
                            <View style={ [ styles.optionIconWrapper, styles.optionIconLeft ] }>
                                <Image
                                    resizeMode="contain"
                                    style={ styles.optionIcon }
                                    source={ require( "./images/account.png" ) }
                                />
                            </View>
                            <Text style={ styles.optionLabel }>Datos personales</Text>
                            <View style={ [ styles.optionIconWrapper, styles.optionIconRight ] }>
                                <Image
                                    resizeMode="contain"
                                    style={ styles.optionIcon }
                                    source={ require( "./images/chevron-right.png" ) }
                                />
                            </View>
                        </TouchableOpacity>
                        {/* Datos de Carrera */}
                        <TouchableOpacity
                            style={ styles.option }
                            onPress={ () => this.detailDate( "CareerData" ) }
                        >
                            <View style={ [ styles.optionIconWrapper, styles.optionIconLeft ] }>
                                <Image
                                    resizeMode="contain"
                                    style={ styles.optionIcon }
                                    source={ require( "./images/graduation-cap.png" ) }
                                />
                            </View>
                            <Text style={ styles.optionLabel }>Datos de carrera</Text>
                            <View style={ [ styles.optionIconWrapper, styles.optionIconRight ] }>
                                <Image
                                    resizeMode="contain"
                                    style={ styles.optionIcon }
                                    source={ require( "./images/chevron-right.png" ) }
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={ styles.horizontalSeparator } />
                {/* Configuration */}
                <View style={ styles.segmentWrapper }>
                    <Text style={ styles.segmentTitle }>Configuraciones</Text>
                    <View style={ styles.optionList }>
                        <TouchableOpacity
                            style={ styles.option }
                            activeOpacity={ 1 }
                            onPress={ () => this.handlePermissionToggle( "notification" ) }
                        >
                            <Text style={ styles.optionLabel }>Recibir notificaciones</Text>
                            <Switch
                                value={ isNotificationEnabled }
                                onValueChange={ () => {
                                    this.handlePermissionToggle( "notification" );
                                } }
                                thumbColor={
                                    isNotificationEnabled
                                        ? THEME.controlSwitchActiveColor
                                        : THEME.controlSwitchInactiveColor
                                }
                                trackColor={ colors.$lighterBlue }
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ styles.option }
                            activeOpacity={ 1 }
                            onPress={ () => this.handlePermissionToggle( "location" ) }
                        >
                            <Text style={ styles.optionLabel }>Compartir ubicación</Text>
                            <Switch
                                value={ isLocationEnabled }
                                onValueChange={ () => {
                                    this.handlePermissionToggle( "location" );
                                } }
                                thumbColor={
                                    isLocationEnabled
                                        ? THEME.controlSwitchActiveColor
                                        : THEME.controlSwitchInactiveColor
                                }
                                trackColor={ colors.$lighterBlue }
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* APP SENATI */}
                <View style={ styles.horizontalSeparator } />
                <View style={ styles.segmentWrapper }>
                    <Text style={ styles.segmentTitle }>Senati Móvil</Text>
                    <View style={ styles.optionList }>
                        <TouchableOpacity
                            onPress={ () => this.detailDate( "Version" ) }
                            style={ styles.option }
                        >
                            <Text style={ styles.optionLabel }>Versión</Text>
                            <View style={ [ styles.optionIconWrapper, styles.optionIconRight ] }>
                                <Image
                                    resizeMode="contain"
                                    style={ styles.optionIcon }
                                    source={ require( "./images/chevron-right.png" ) }
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={ () => this.detailDate( "Terms" ) }
                            style={ styles.option }
                            disabled={ !connected }
                        >
                            <Text style={ styles.optionLabel }>Términos de uso</Text>
                            <View style={ [ styles.optionIconWrapper, styles.optionIconRight ] }>
                                <Image
                                    resizeMode="contain"
                                    style={ [
                                        styles.optionIcon,
                                        {
                                            tintColor: connected
                                                ? colors.$lightBlue
                                                : colors.$lightGray,
                                        },
                                    ] }
                                    source={ require( "./images/chevron-right.png" ) }
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={ styles.segmentWrapper }>
                    <Text style={ styles.footerText }>
                        Si te gusta la aplicación,
                        <Text style={ styles.footerTextHighlighted } onPress={ this.handleReviewLink }>
                            {" "}
                            {"por favor deja un reseña"}
                        </Text>
                    </Text>
                    <TouchableOpacity
                        style={ styles.buttonLogout }
                        onPress={ () => {
                            const { navigation } = this.props;
                            navigation.navigate( "Logout" );
                            firebase.analytics().setCurrentScreen("Logout", "Account option")
                          //  Answers.logContentView( "Logout", "Account option" );
                        } }
                    >
                        <Text style={ styles.buttonLogoutText }>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
const mapStateToProps = ( state ) => {
    const isNotificationEnabled = state.permissions.subscriptionState.subscriptionEnabled;
    const isLocationEnabled = state.permissions.locationShared.enabled;
    const { connected } = state.network;
    const { lastUpdated } = state.student;

    return {
        isNotificationEnabled,
        isLocationEnabled,
        connected,
        lastUpdated,
    };
};
export default connect( mapStateToProps )( Account );
