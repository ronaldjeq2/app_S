import React, { Component } from "react";
import { View, BackHandler } from "react-native";
import PropTypes from "prop-types";
import { WebView } from 'react-native-webview';
import firebase from 'react-native-firebase';
//import { Crashlytics } from "react-native-fabric"; // Get Crashlytics component
import { connect } from "react-redux";
import Header from "./Header";
import Error from "./Error";
import { Gears } from "../../components/Loading";
import { sinfoRequest, sinfoLogout } from "../../actions/sinfo";
import styles from "./styles";

/*
    Features:
    - [x] Handle backButton hardware for goBack in webView,
    - [x] Validate credentials in the server and get the code for auto login
    - [x] Render the SINFO into webview
    - [x] Add close button for close sinfo session and then go to Home Screen
    - [x] Handle the leftButton header to back

    Show Message when:
    - [x] Server is validating credentials
    - [x] AutoLogin is loading
    - [x] Account is market as Blocked
    - [x] Password is expired
    - [x] The password used for login in the apps is not longer valid
    - [x] Network Error: Cant establish connection to the server
    - [x] Timeout of the Api server
*/
class Sinfo extends Component {
    static propTypes = {
        isFetching: PropTypes.bool,
        code: PropTypes.string,
        uri: PropTypes.string,
        dispatch: PropTypes.func,
        hasError: PropTypes.bool,
        errorKey: PropTypes.string,
        errorMessage: PropTypes.string,
    };

    constructor( props ) {
        super( props );
        this.state = {
            showLoadingMessage: true,
            message: "Validando credenciales ...",
            canGoBack: false,
        };
        this.counter = 0;
        this.webviewRef = undefined;
        this.backButtonListener = null;
    }

    componentDidMount() {
        firebase.crashlytics().log("Componente Sinfo fue montado")

      //  Crashlytics.setString( "componentDidMount", "Sinfo" );
     //   Crashlytics.log( "Sinfo montado" );
        const { dispatch } = this.props;
        dispatch( sinfoRequest() );

        this.backButtonListener = BackHandler.addEventListener( "hardwareBackPress", () => this.handleGoBack() );
    }

    componentWillUnmount() {
        this.backButtonListener.remove();
    }

    onNavigationStateChange = ( state ) => {
        this.catchNavigationLogout( { url: state.url, isLoading: state.loading } );
        this.watchForCantGoBackUrls( state.url );
    };

    onWebViewFinishLoad = () => {
        const { code } = this.props;
        switch ( this.counter ) {
        case 0:
            // The login form has loaded, inject the code and submit the form
            this.setState( {
                message: "Conectando con SINFO ...",
            } );
            this.webviewRef.injectJavaScript( code );
            this.counter += 1;
            break;
        case 1:
            this.setState( { showLoadingMessage: false } );
            this.counter += 1;
            break;
        default:
            break;
        }
    };

    /*
        Redirect to Home Screen when the url matches and they have finished the load
    */
    catchNavigationLogout = ( { url, isLoading } ) => {
        const { dispatch } = this.props;
        const { showLoadingMessage } = this.state;

        const logoutPages = [
            "twbkwbis.P_Logout", // Shows up when user press the logout button
            "twbkwbis.P_FirstMenu", // Shows up on terms and conditions screen
        ];

        const hasLogoutUrl = logoutPages.find( page => url.includes( page ) ) !== undefined;

        if ( hasLogoutUrl && showLoadingMessage === false ) {
            this.setState( {
                message: "Cerrando la sesion de SINFO ...",
                showLoadingMessage: true,
            } );
        }
        else if ( hasLogoutUrl && showLoadingMessage ) {
            dispatch( sinfoLogout() );
        }
    };

    watchForCantGoBackUrls = ( url ) => {
        const { canGoBack } = this.state;
        const blackListedUrls = [
            "twbkwbis.P_Logout", // Logout Page
            "twbkwbis.P_FirstMenu", // Cancel Page for Terms and Conditions
            "msg=WELCOME", // First page after Login Page
            "twbkwbis.P_ValLogin", // Login, Validation and T&C Page,
        ];

        const isBlackListed = blackListedUrls.find( page => url.includes( page ) ) !== undefined;

        if (
            isBlackListed
            // Condition for set the state only once
            && canGoBack !== false
        ) {
            this.setState( { canGoBack: false } );
        }
        // Condition for set the state only once
        else if ( !isBlackListed && canGoBack !== true ) {
            this.setState( { canGoBack: true } );
        }
    };

    handleClose = () => {
        const { dispatch } = this.props;
        const existWebView = this.webviewRef && this.webviewRef.injectJavaScript !== undefined;

        // if exist webview the dispatch events fire through catchNavigationLogout function
        if ( existWebView ) {
            this.webviewRef.injectJavaScript( "window.location.href = 'twbkwbis.P_Logout'" );
        }
        // when dont have the webView reference fires the sinfoLogout Action
        else {
            dispatch( sinfoLogout() );
        }
    };

    handleGoBack = () => {
        const { canGoBack } = this.state;
        const existWebView = this.webviewRef && this.webviewRef.injectJavaScript !== undefined;

        if ( existWebView && canGoBack ) {
            this.webviewRef.goBack();
            return true;
        }
        this.handleClose();
        return true;
    };

    render() {
        const { showLoadingMessage, message, canGoBack } = this.state;
        const {
            isFetching, uri, hasError, errorKey, errorMessage,
        } = this.props;

        return (
            <View style={ styles.container }>
                <Header
                    isLeftButtonDisabled={ !canGoBack }
                    onLeftButtonPress={ () => this.handleGoBack() }
                    onRightButtonPress={ () => this.handleClose() }
                />
                {hasError && (
                    <Error
                        errorKey={ errorKey }
                        messageFromError={ errorMessage }
                        onPressButton={ () => this.handleClose() }
                    />
                )}
                {!hasError && showLoadingMessage && <Gears message={ message } />}
                {/* Showup webview when fetching data are finished */}
                {!hasError
                    && !isFetching && (
                    <WebView
                        ref={ ( ref ) => {
                            this.webviewRef = ref;
                        } }
                        style={ styles.webView }
                        source={ { uri: `${ uri }` } }
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState={ false }
                        onNavigationStateChange={ this.onNavigationStateChange }
                        onLoad={ this.onWebViewFinishLoad }
                    />
                )}
            </View>
        );
    }
}

const mapStateToProps = ( state ) => {
    const {
        isFetching, code, uri, hasError, errorKey, errorMessage,
    } = state.sinfo;
    return {
        hasError,
        errorKey,
        errorMessage,
        isFetching,
        code,
        uri,
    };
};

export default connect( mapStateToProps )( Sinfo );
