import React, { Component } from "react";
import {
    View, ScrollView, Image, Text, Switch, TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import styles from "../../styles";
import { Button } from "../../../../components";
import { colors } from "../../../../config/styles";
import settings from "../../../../config/settings";

export default class InfoApp extends Component {
    static propTypes = {
        item: PropTypes.object,
    };

    constructor( props ) {
        super( props );

        this.state = {};
    }

    render() {
        const { Lanzamiento } = this.props.item;
        return (
            <View style={ styles.infoStudent }>
                <Image source={ require( "../../images/logo-vertical.png" ) } style={ styles.logo } />
                <View style={ styles.viewDate }>
                    <Text style={ { fontWeight: "bold", fontSize: 15 } }>App Senati Móvil</Text>
                    <Text>{`Versión ${ settings.appVersion }`}</Text>
                    <Text>{Lanzamiento}</Text>
                </View>
            </View>
        );
    }
}
