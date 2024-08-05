import React from "react";
import { View, Text, Dimensions } from "react-native";
import PropTypes from "prop-types";

import { colors } from "../../../../config/styles";

const DEVICE_HEIGHT = Dimensions.get( "window" ).height;

const style = {
    container: {
        flex: 1,
        backgroundColor: colors.$senatiWhite,
        alignContent: "center",
        alignItems: "center",
    },
    tittle: {
        marginLeft: 20,
        fontSize: 12,
        color: colors.$lighterBlue,
        fontWeight: "bold",
        marginBottom: 5,
    },
    text: { marginTop: DEVICE_HEIGHT / 3 },
    textDay: {
        width: 80,
    },
    textNull: {
        marginTop: 5,
        marginHorizontal: 20,
        alignSelf: "center",
    },
};
const NotInfo = ( { message } ) => (
    <View style={ style.container }>
        <Text style={ style.text }>{message}</Text>
    </View>
);
NotInfo.propTypes = {
    message: PropTypes.string,
};
export default NotInfo;
