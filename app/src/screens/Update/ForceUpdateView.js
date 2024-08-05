import React, { Component } from "react";

import {
    StyleSheet, Text, View, Image, TouchableOpacity, Linking, Platform,
} from "react-native";

import Dimensions from "Dimensions";
import { colors, THEME } from "../../config/styles";
import { Button } from "../../components/Buttons";
import Logo from "../Login/Logo";

const DEVICE_HEIGHT = Dimensions.get( "window" ).height;

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: colors.$white,
    },
    logoContainer: {
        backgroundColor: colors.$senatiBlue,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        height: 140,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginTop: Platform.OS === "ios" ? 20 : 10,
    },
    image: {
        width: DEVICE_HEIGHT * 0.5,
        height: DEVICE_HEIGHT * 0.4,
        backgroundColor: colors.$white,
        alignSelf: "center",
    },
    message: {
        backgroundColor: colors.$white,
        marginHorizontal: 30,
        marginTop: 10,
    },
    headText: {
        color: colors.$senatiBlue,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    contentText: {
        color: colors.controlSwitchInactiveColor,
        fontSize: 15,
        marginTop: 15,
        alignSelf: "center",
        textAlign: "center",
    },
    contentbutton: {
        marginVertical: 25,
        alignSelf: "center",
        width: 300,
    },
    textButton: {
        color: colors.$white,
        fontSize: 20,
    },
} );

export default class ForceUpdateView extends Component {
    handleReviewLink = () => {
        if ( Platform.OS === "ios" ) {
            Linking.openURL( "https://itunes.apple.com/pe/app/senati-m%C3%B3vil/id1358336389?mt=8" );
        }
        else {
            Linking.openURL( "https://play.google.com/store/apps/details?id=edu.senati.app" );
        }
    };

    render() {
        return (
            <View style={ styles.container }>
                <View style={ styles.logoContainer }>
                    <Image source={ require( "./images/logo-vertical.png" ) } style={ styles.logo } />
                </View>
                <Image source={ require( "./images/updateImage.png" ) } style={ styles.image } />
                <View style={ styles.message }>
                    <Text style={ styles.headText }>DEBES ACTUALIZAR</Text>
                    <Text style={ styles.contentText }>
                        {
                            "Tenemos muchas novedades para tí, por favor actualiza la versión de la App"
                        }
                    </Text>
                </View>
                <View style={ styles.contentbutton }>
                    <Button
                        text="Actualizar"
                        onPress={ this.handleReviewLink }
                        color={ colors.$senatiBlue }
                    />
                </View>
            </View>
        );
    }
}
