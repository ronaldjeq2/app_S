import React, { Component } from "react";
import {
    View, Keyboard, Animated, Platform,
} from "react-native";

import styles, { imageSizes } from "./styles";

const ANIMATION_DURATION = 250;

class Logo extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            imageWidth: new Animated.Value( imageSizes.$largeImageSize ),
        };
    }

    componentDidMount() {
        const name = Platform.OS === "ios" ? "Will" : "Did";
        this.keyboardDidShowListener = Keyboard.addListener(
            `keyboard${ name }Show`,
            this.keyboardWillShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            `keyboard${ name }Hide`,
            this.keyboardWillHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardWillShow = () => {
        const { imageWidth } = this.state;
        Animated.timing( imageWidth, {
            toValue: imageSizes.$smallImageSize,
            duration: ANIMATION_DURATION,
            // TODO: activate the native driver
            // will change the width property
            // because is not supported by the native animated module
            // useNativeDriver: true,
        } ).start();
    };

    keyboardWillHide = () => {
        const { imageWidth } = this.state;
        Animated.timing( imageWidth, {
            toValue: imageSizes.$largeImageSize,
            duration: ANIMATION_DURATION,
        } ).start();
    };

    render() {
        const { imageWidth } = this.state;
        const imageStyles = [ styles.containerImage, { width: imageWidth, height: imageWidth } ];

        return (
            <View style={ styles.container }>
                <Animated.Image
                    resizeMode="contain"
                    style={ imageStyles }
                    source={ require( "./images/logo-vertical.png" ) }
                />
            </View>
        );
    }
}

export default Logo;
