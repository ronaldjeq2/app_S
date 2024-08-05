import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View, Dimensions,
} from "react-native";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import { connect } from "react-redux";
import Orientation from 'react-native-orientation-locker';

import settings from "../../config/settings";
import "../../reducers";
import { accountRequestInfoAction } from "../../actions/student";
import { Loader } from "../../components";
import { Errortext } from "../../components/Error";
import Header from "./components/Header";
import StudentCard from "./components/StudentCard";
import WorkerCard from "./components/WorkerCard";

// Passport aspect ratio 4 cm x 4 cm
const PHOTO_RATIO = 4 / 4;

const WINDOW_WIDTH = Dimensions.get( "window" ).width;
const WINDOW_HEIGHT = Dimensions.get( "window" ).height;
const ORIENTATION_PORTRAIT = WINDOW_HEIGHT > WINDOW_WIDTH;

const DEVICE_WIDTH = ORIENTATION_PORTRAIT ? WINDOW_WIDTH : WINDOW_HEIGHT;

class CardPhoto extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        hasError: PropTypes.bool,
        user: PropTypes.object,
        token: PropTypes.string,
        connected: PropTypes.bool,
    };

    constructor( props ) {
        super( props );

        this.state = {
            activateSwitch: false,
            orientationActual: "vertical",
        };
        const { dispatch } = this.props;
        dispatch( accountRequestInfoAction() );
    }

    componentDidMount() {
        const {
            user, token, connected, hasError,
        } = this.props;
        if ( user.hasWorkCard ) {
            this.changueOrientation( "vertical" );
        }
        else {
            this.changueOrientation( "horizontal" );
        }
        firebase.crashlytics().log("StudentCard fue montado")

       // Crashlytics.setString( "componentDidMount", "StudentCard" );
        //Crashlytics.log( "StudentCard fue montado" );
    }

    componentDidUpdate( prevProps ) {
        const { hasStudentCard, hasWorkCard } = this.props.user;
        if (
            prevProps.user.hasStudentCard !== hasStudentCard
            || prevProps.user.hasWorkCard !== hasWorkCard
        ) {
            if ( hasWorkCard ) {
                this.changueOrientation( "vertical" );
            }
            else {
                this.changueOrientation( "horizontal" );
            }
        }
    }

    componentWillUnmount() {
        if ( this.state.orientationActual === "horizontal" ) {
            Orientation.lockToPortrait();
        }

          Orientation.lockToLandscape();
       Orientation.unlockAllOrientations();
    }

    handleGoBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    changueOrientation = ( orientationView ) => {
        if ( orientationView === "horizontal" ) {
            this.setState( {
                orientationActual: "horizontal",
            } );
            Orientation.lockToLandscape();
        }
        else {
            this.setState( {
                orientationActual: "vertical",
            } );
            Orientation.lockToPortrait();
        }
    };

    render() {
        const { orientationActual, activateSwitch } = this.state;

        const {
            user, token, connected, hasError,
        } = this.props;
        const alterOrientation = orientationActual === "vertical" ? "horizontal" : "vertical";
        const carnetChangue = orientationActual === "vertical" ? "estudiante" : "trabajador";
        const photoHeight = DEVICE_WIDTH * 0.45 - 20;
        let photoWidth = 150;
        if ( user.hasPhoto ) {
            photoWidth = photoHeight * PHOTO_RATIO;
        }

        if ( user.isLoading && !user.hasStudentCard ) {
            return <Loader />;
        }

        return (
            <View>
                <Header
                    onLeftButtonPress={ () => this.handleGoBack() }
                    onRightSwitchPress={ () => {
                        this.setState( { activateSwitch: !activateSwitch } );
                        this.changueOrientation( alterOrientation );
                    } }
                    twoFotocheck={ user.hasWorkCard && user.hasStudentCard }
                    carnetChangue={ carnetChangue }
                    headerHeight={ orientationActual === "vertical" ? 56 : 34 }
                />
                <Errortext lastUpdated={ user.lastUpdated } />
                {orientationActual === "horizontal" && (
                    <StudentCard
                        token={ token }
                        connected={ connected }
                        hasError={ hasError }
                        user={ user }
                    />
                )}
                {orientationActual === "vertical" && (
                    <WorkerCard
                        token={ token }
                        connected={ connected }
                        hasError={ hasError }
                        user={ user }
                    />
                )}
            </View>
        );
    }
}

const mapStateToProps = state => ( {
    user: state.student,
    token: state.session.token,
    hasError: state.error.hasError,
    connected: state.network.connected,
} );
export default connect( mapStateToProps )( CardPhoto );


