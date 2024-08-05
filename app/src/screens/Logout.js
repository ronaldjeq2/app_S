import React, { Component } from "react";
import {
    View, Text, ActivityIndicator, Image, StatusBar,
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { colors } from "../config/styles";
import { logoutRequest } from "../actions/session";


class Logout extends Component {


    state = {};

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch( logoutRequest() );
    }

    render() {
        return (
            <View
                style={ {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.$blue,
                } }
            >
                <StatusBar backgroundColor={ colors.$darkBlue } barStyle="light-content" />
                <Image
                    resizeMode="contain"
                    style={ { height: 180, width: 180 } }
                    source={ require( "./Login/Logo/images/logo-vertical.png" ) }
                />
                <ActivityIndicator size="large" color={ colors.$white } />
                <Text
                    style={ {
                        color: colors.$white,
                        fontSize: 16,
                        padding: 20,
                    } }
                >
                    Cerrando sesión...
                </Text>
            </View>
        );
    }
}

export default connect()( Logout );
