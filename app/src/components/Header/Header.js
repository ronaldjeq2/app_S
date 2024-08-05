import React from "react";
import {
    View, Image, StatusBar, Platform,
} from "react-native";

import { colors } from "../../config/styles";
import styles from "./styles";

const Header = () => (
    <View style={ styles.container }>
        <StatusBar backgroundColor={ colors.$darkBlue } barStyle="light-content" />
        {Platform.OS === "ios" && <View style={ styles.statusBarIosWrapper } />}
        <Image
            resizeMode="contain"
            source={ require( "./images/senati-logo-horizontal.png" ) }
            style={ styles.headerImage }
        />
    </View>
);
export default Header;
