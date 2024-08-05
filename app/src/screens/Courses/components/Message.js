import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

import { colors } from "../../../config/styles";

const styles = {
    container: {
        backgroundColor: "#fff",
        marginTop: 20,
        padding: 20,
    },

    title: {
        color: colors.$senatiBlue,
        fontSize: 18,
        fontWeight: "bold",
    },

    content: {
        color: "#969FAA",
        fontSize: 14,
    },
};

const Message = ( { title = "", content = "" } ) => (
    <View style={ styles.container }>
        <Text style={ styles.title }>{title}</Text>
        <Text style={ styles.content }>{content}</Text>
    </View>
);

Message.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default Message;
