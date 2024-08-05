import React from "react";
import {
    View, ScrollView, Image, Text, TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

import NavigationService from "../../services/Navigation";

import styles from "./styles";

const errorKeyList = {
    NETWORK_ERROR: {
        image: require( "./images/astronaut.png" ),
        title: "Hemos perdido la conexión",
        firstMessage:
            "No pudimos establecer contacto con nuestros servidores, por favor revisa tu conexión a internet.",
        secondMessage:
            "Por favor intenta nuevamente en unos momentos o envíanos un correo a app@senati.edu.pe",
    },
    TIMEOUT_ERROR: {
        image: require( "./images/astronaut.png" ),
        title: "Tiempo de espera agotado",
        firstMessage: "El servidor esta tardando mucho en responder",
        secondMessage: "Intenta nuevamente en unos momentos",
    },
    ACCOUNT_BLOCKED: {
        image: require( "./images/account-blocked.png" ),
        title: "Cuenta bloqueada",
        firstMessage:
            "Tu cuenta se ha bloqueado por muchos intentos fallidos o falta de uso en el sistema.",
        secondMessage:
            "Para desbloquearla, acercate a tu escuela y solicita el desbloqueo y/o el reinicio de contraseña.",
    },
    ACCOUNT_PASSWORD_EXPIRED: {
        image: require( "./images/account-password-expired.png" ),
        title: "Tu contraseña a expirado",
        firstMessage: "Por seguridad debes cambiar tu contraseña periodicamente.",
        secondMessage: "Acercate a tu escuela y solicita el reinicio de contraseña.",
    },
    ACCOUNT_PASSWORD_INVALID: {
        image: require( "./images/account-password-invalid.png" ),
        title: "Contraseña incorrecta",
        firstMessage: "La contraseña que usaste para iniciar sesión en la APP ya no es válida.",
        secondMessage: "Cierra sesión y vuelve a ingresar con tu contraseña actual.",
    },
    UNKNOWN: {
        image: require( "./images/astronaut.png" ),
        title: "UPPS! Hubo un Error",
        firstMessage:
            "Por favor envianos un correo a app@senati.edu.pe con tu ID para poder ayudarte",
        secondMessage: "",
    },
};

const Error = ( { errorKey = "UNKNOWN", onPressButton, messageFromError = "" } ) => {
    if ( errorKey === "UNKNOWN" ) {
        errorKeyList[ errorKey ].secondMessage = messageFromError;
    }

    const {
        image, title, firstMessage, secondMessage,
    } = errorKeyList[ errorKey ];

    return (
        <ScrollView style={ { flex: 1 } }>
            <View style={ styles.errorContainer }>
                <View style={ styles.errorImageWrapper }>
                    <Image resizeMode="cover" style={ styles.errorImage } source={ image } />
                </View>

                <Text style={ styles.errorTitle }>{title.toUpperCase()}</Text>
                {firstMessage && <Text style={ styles.errorMessage }>{firstMessage}</Text>}
                {secondMessage && <Text style={ styles.errorMessage }>{secondMessage}</Text>}

                <TouchableOpacity
                    style={ [
                        styles.errorButton,
                        errorKey === "ACCOUNT_PASSWORD_INVALID" ? styles.errorButtonSecondary : {},
                    ] }
                    activeOpacity={ 0.8 }
                    onPress={ onPressButton }
                >
                    <Text style={ styles.errorButtonText }> Volver </Text>
                </TouchableOpacity>

                {errorKey === "ACCOUNT_PASSWORD_INVALID" && (
                    <TouchableOpacity
                        style={ styles.errorButton }
                        activeOpacity={ 0.8 }
                        onPress={ () => NavigationService.navigate( "Logout" ) }
                    >
                        <Text style={ styles.errorButtonText }> Cerrar sesion </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

Error.propTypes = {
    errorKey: PropTypes.string,
    onPressButton: PropTypes.func,
    messageFromError: PropTypes.string,
};

export default Error;
