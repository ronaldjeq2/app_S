import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";

import styles from "./styles";

const IconButton = ( {
    text, onPress, icon, disable,
} ) => (
    <TouchableOpacity style={ styles.iconContainer } onPress={ onPress } disabled={ disable }>
        <Image
            resizeMode="contain"
            style={ disable ? styles.iconDisable : styles.icon }
            source={ icon }
        />
        <Text>{text}</Text>
    </TouchableOpacity>
);

IconButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.number.isRequired,
    disable: PropTypes.bool,
};

export default IconButton;
