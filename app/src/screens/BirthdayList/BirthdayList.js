import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View, Text, ActivityIndicator, ScrollView,
} from "react-native";
import { connect } from "react-redux";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import styles from "./styles";

import { birthdayRequest } from "../../actions/birthday";
import { Errortext } from "../../components/Error";
import Greeting from "./Greeting";
import Upcoming from "./Upcoming";

class Birthday extends Component {
    static propTypes = {
        isLoadedbirthday: PropTypes.bool,
        hasError: PropTypes.bool,
        listhappybirthday: PropTypes.array,
        listnothappybirthday: PropTypes.object,
        finishlist: PropTypes.bool,
        existbirthdaytoday: PropTypes.bool,
        birthdayList: PropTypes.array,
        lastUpdated: PropTypes.string,
    };

    constructor( props ) {
        super( props );
        this.getBirthdayList();
    }

    state = {};

    componentDidMount() {
        firebase.crashlytics().log("BirthdaysScreen fue montado" )

      //  Crashlytics.setString( "componentDidMount", "BirthdaysScreen" );
       // Crashlytics.log( "BirthdaysScreen fue montado" );
    }

    getBirthdayList = () => {
        const datereference = new Date().toISOString().split( "T" )[ 0 ];
        this.props.dispatch( birthdayRequest( datereference ) );
    };

    render() {
        const {
            hasError,
            finishlist,
            existbirthdaytoday,
            listhappybirthday,
            listnothappybirthday,
            birthdayList,
            lastUpdated,
        } = this.props;
        const today = fnsFormat( new Date(), "DD-MM-YY", {
            locale: fnsESLocale,
        } ).toUpperCase();

        if ( !finishlist ) {
            return (
                <View
                    style={ {
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                    } }
                >
                    <ActivityIndicator size="large" color="#274188" style={ styles.indicator } />
                </View>
            );
        }
        if ( birthdayList.length === 0 ) {
            return (
                <View style={ [ styles.empty, { flex: 1, backgroundColor: "white" } ] }>
                    <Errortext lastUpdated={ lastUpdated } />
                    <Text style={ styles.emptyText }>Tu lista de próximos cumpleaños está vacía</Text>
                </View>
            );
        }
        return (
            <ScrollView style={ styles.container }>
                <Errortext lastUpdated={ lastUpdated } />
                <Greeting
                    isActivebirthday={ existbirthdaytoday }
                    listhbirthday={ listhappybirthday }
                    today={ today }
                />
                <Upcoming
                    listnothappybirthday={ listnothappybirthday }
                    isActivebirthday={ !existbirthdaytoday }
                />
            </ScrollView>
        );
    }
}
const mapStateToProps = ( state ) => {
    const { hasError } = state.error;
    const {
        isLoadedbirthday,
        listhappybirthday,
        listnothappybirthday,
        birthdayList,
        existbirthdaytoday,
        finishlist,
        lastUpdated,
    } = state.birthday;

    return {
        isLoadedbirthday,
        hasError,
        listhappybirthday,
        listnothappybirthday,
        finishlist,
        existbirthdaytoday,
        birthdayList,
        lastUpdated,
    };
};
export default connect( mapStateToProps )( Birthday );
