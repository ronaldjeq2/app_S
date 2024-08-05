import React from "react";
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    Image,
    Platform,
    Text,
    TouchableOpacity
} from "react-native";
import { colors } from "../config/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import OneSignal from "react-native-onesignal";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import settings from "../config/settings";
import { getStoredToken } from "../actions/session";

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.$blue,
    },
} );

class AuthLoadingScreen extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
    };
    constructor( props ) {
        super( props );
        this.bootstrapAsync();
    }
    componentDidMount() {
            OneSignal.init( settings.oneSignalKey, {
                kOSSettingsKeyAutoPrompt: false,
                kOSSettingsKeyInAppLaunchURL: false,
                kOSSSettingsKeyPromptBeforeOpeningPushURL: false,
                kOSSettingsKeyInFocusDisplayOption: 2,
                // 0 = None: When your app is open, OneSignal will not display a notification
                // (it will be up to your app to provide a custom UI to display it)
                // 1 = In App Alert: Notifications will display as a popup
                // 2 = Notification: Notifications will display as normal notifications.
            } );

    }

    bootstrapAsync = async () => {
        const { dispatch } = this.props;
        try {
            dispatch( getStoredToken() );
        }
        catch ( error ) {
            firebase.crashlytics().log(`${ error }`)
            firebase.crashlytics().recordCustomError(
                'Custom Error',
                'Oh No!',
                [
                    {
                        className: 'AuthLoadingScreen',
                        fileName: 'AuthLoader.js',
                        functionName: 'bootstrapAsync',
                        lineNumber: 55
                    }
                ]
            );
/*             if ( Platform.OS === "ios" ) {
                firebase.crashlytics().log("plataforma IOS, error en el método =>  dispatch( getStoredToken(), Screen => AuthLoader.js )")
              //  Crashlytics.recordError( `${ error }` );
            }
            else {
               // Crashlytics.logException( `${ error }` );
            } */
        }
    };

    render() {
        const {  message } = this.props;

        return (
            <View style={ styles.container }>
                <StatusBar backgroundColor={ colors.$blue } barStyle="light-content" />
                <Image
                    resizeMode="contain"
                    style={ { height: 200, width: 200 } }
                    source={ require( "./Login/Logo/images/logo-vertical.png" ) }
                />
                <ActivityIndicator
                    size="large"
                    color={ colors.$white }
                    style={ {
                        position: "absolute",
                        bottom: 50,
                    } }
                />
                <Text  style={ { color: "white", fontSize: 16 } }>{message}</Text>
            </View>
        );
    }
}
const mapStateToProps = ( state ) => {
    const { message } = state.session;
    return {
        message,
    };
};
export default connect( mapStateToProps )( AuthLoadingScreen );

