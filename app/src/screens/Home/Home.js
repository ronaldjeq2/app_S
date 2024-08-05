import React, { Component } from "react";
import { ScrollView, View } from "react-native";
//import { Crashlytics, Answers } from "react-native-fabric";
import firebase from 'react-native-firebase';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { permissionInitialRequestAction } from "../../actions/permissions";
import { IconButton } from "../../components/Buttons";
import { Header } from "../../components/Header";
import RightIconButton from "../../components/Header/RightIconButton";
import styles from "./styles";
import { Errortext } from "../../components/Error";
import IconStyles from "../../components/Buttons/styles";

class Home extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        navigation: PropTypes.object,
        error_Message: PropTypes.string,
        hasError: PropTypes.bool,
        hasStudentCard: PropTypes.bool,
        connected: PropTypes.bool,
        hasWorkCard: PropTypes.bool,
    };

    componentDidMount() {
        firebase.crashlytics().log("Componente Home fue montado")

        /*   Crashlytics.setString( "componentDidMount", "Home" );
          Crashlytics.log( "Home fue montado" ); */
        const { dispatch } = this.props;
        dispatch(permissionInitialRequestAction());
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: <Header />,
        headerLeft: <View />,
        headerRight: (
            <RightIconButton
                viewNotifications={() => {
                    // Crashlytics.log( `HomeScreen event: onclick_${ "Notifications" }` );
                    // Answers.logContentView( "Notifications", "vista" );
                    navigation.navigate("Notifications");
                }}
            />
        ),
    });

    iconClickHandler = (screenName) => {
        const { navigation } = this.props;
        firebase.crashlytics().log(`HomeScreen event: onclick_${screenName}`)
        firebase.analytics().setCurrentScreen(screenName, "vista")

        //Crashlytics.log( `HomeScreen event: onclick_${ screenName }` );
        // Answers.logContentView( screenName, "vista" );
        navigation.navigate(screenName);
    };

    /*
    TODO:
    Add code for request:
        - Notification permission
        - Location Permission
    */

    render() {
        const {
            hasError, hasStudentCard, connected, hasWorkCard
        } = this.props;
        const existFotocheck = hasStudentCard || hasWorkCard;
        return (
            <View style={styles.container}>
                <Errortext lastUpdated="" />
                <ScrollView
                    contentContainerStyle={{
                        marginTop: 15,
                        justifyContent: "center",
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}
                >
                    <IconButton
                        onPress={() => this.iconClickHandler("Sinfo")}
                        text="Sinfo"
                        icon={require("./images/sinfo.png")}
                        disable={!connected}
                    />

                    <IconButton
                        onPress={() => this.iconClickHandler("CoursesStack")}
                        text="Mis Cursos"
                        icon={require("./images/notas.png")}
                        disable={false}
                    />

                    <IconButton
                        onPress={() => this.iconClickHandler("ClassTimes")}
                        text="Horario"
                        icon={require("./images/calendar.png")}
                        disable={false}
                    />

                    <IconButton
                        onPress={() => this.iconClickHandler("Account")}
                        text="Mi Cuenta"
                        icon={require("./images/account.png")}
                        disable={false}
                    />

                    <IconButton
                        onPress={() => this.iconClickHandler("Birthdays")}
                        text="Cumpleaños"
                        icon={require("./images/birthday.png")}
                        disable={false}
                    />

                    <IconButton
                        onPress={() => this.iconClickHandler("Links")}
                        text="Enlaces"
                        icon={require("./images/links.png")}
                        disable={!connected}
                    />
                    <IconButton
                        onPress={() => this.iconClickHandler("PaymentSchedule")}
                        text="Cronograma"
                        icon={require("./images/payment.png")}
                        disable={false}
                    />
                    {existFotocheck && (
                        <IconButton
                            onPress={() => this.iconClickHandler("Fotocheck")}
                            text="Mi identificación"
                            icon={require("./images/carnet.png")}
                            disable={false}
                        />
                    )}

                    <View style={IconStyles.iconContainer} />
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const hasError = state.error.hasError;
    const error_Message = state.error.error_Message;
    const { hasStudentCard, hasWorkCard } = state.student;
    const connected = state.network.connected;
    return {
        hasError,
        error_Message,
        hasStudentCard,
        connected,
        hasWorkCard,
    };
};
export default connect(mapStateToProps)(Home);
