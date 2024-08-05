import React from "react";
import { View, Image } from "react-native";

import styles from "./styles";

const BackButton = ( /* {  tintColor, title } */ ) => (
    <View style={ styles.backButton }>
        <Image
            resizeMode="contain"
            source={ require( "./images/back-icon.png" ) }
            style={ styles.backButtonImage }
        />
    </View>
);

export default BackButton;
