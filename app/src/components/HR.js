import React from "react";
import { View, StyleSheet } from "react-native";

import { THEME } from "../config/styles";

const styles = StyleSheet.create( {
    hr: {
        borderWidth: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: THEME.separatorColor,
    },
} );

const HR = () => <View style={ styles.hr } />;

export default HR;
