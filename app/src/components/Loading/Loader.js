import React from "react";
import { View, ActivityIndicator } from "react-native";

import { colors } from "../../config/styles";

const Loader = () => (
    <View
        style={ {
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: colors.$white,
        } }
    >
        <ActivityIndicator size="large" color={ colors.$lightBlue } />
    </View>
);

export default Loader;
