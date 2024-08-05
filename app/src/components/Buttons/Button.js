import React, { Component } from "react";
import {
    TouchableOpacity, Text, View, ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { colors } from "../../config/styles";

import styles from "./styles";

const Button = ( {
    text, onPress, isDisabled, isFetching, color,
} ) => {
    const styleButton = [ styles.buttonWrapper ];
    if ( color ) {
        styleButton.push( { backgroundColor: color } );
    }
    if ( isDisabled === true ) {
        return (
            <View style={ [ styles.buttonWrapper, styles.buttonWrapperDisabled ] }>
                <Text style={ styles.buttonText }>{text}</Text>
            </View>
        );
    }

    if ( isFetching === true ) {
        return (
            <View style={ [ styles.buttonWrapper ] }>
                <ActivityIndicator size="small" color="#ffffff" />
            </View>
        );
    }

    return (
        <TouchableOpacity style={ styleButton } onPress={ onPress }>
            <Text style={ styles.buttonText }>{text}</Text>
        </TouchableOpacity>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
    updated: PropTypes.string,
};

export default Button;
