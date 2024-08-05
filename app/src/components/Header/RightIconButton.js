import React from "react";
import {
    View, Image, StatusBar, Platform, TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

import { colors } from "../../config/styles";
import styles from "./styles";

const RightIconButton = ( { viewNotifications } ) => (
    <TouchableOpacity
        style={ {
            padding: 5,
            height: "100%",
            width: 50,
            justifyContent: "center",
        } }
        onPress={ viewNotifications }
    >
        <View>
            <Image
                resizeMode="stretch"
                source={ require( "./images/notification.png" ) }
                style={ styles.notificationImage }
            />
        </View>
    </TouchableOpacity>
);
RightIconButton.propTypes = {
    viewNotifications: PropTypes.func,
};
export default RightIconButton;
