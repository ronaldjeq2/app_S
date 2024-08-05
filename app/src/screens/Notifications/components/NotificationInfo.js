import React from "react";
import {
    View, Text, Image, PixelRatio,
} from "react-native";
import PropTypes from "prop-types";
import { HR } from "../../../components";
import TextWithdpiVariable from "../../../components/Text/TextWithdpiVariable";
import ImageIconWithdpiVariable from "../../../components/Image/ImageIconWithdpiVariable";

import { colors } from "../../../config/styles";

const styles = {
    imageContainer: {
        backgroundColor: "#D3D9E0",
    },
    image: {
        tintColor: colors.$lightBlue,
    },
    title: { fontWeight: "bold" },
    message: {
        width: "90%",
        marginTop: 6,
        marginBottom: 3,
    },
    url: {
        textDecorationLine: "underline",
        width: "85%",
        color: colors.$lightBlue,
        marginTop: 4,
    },
    date: {
        textAlign: "right",
        marginBottom: 5,
        width: "100%",
    },
};

const iconList = {
    matricula: require( "../images/matricula.png" ),
    certificado: require( "../images/certificado.png" ),
    notas: require( "../images/notas.png" ),
    evento: require( "../images/evento.png" ),
    recordatorio: require( "../images/recordatorio.png" ),
};

const NotificationInfo = ( { notification, viewScreen } ) => {
    const icon = iconList[ notification.icon ] || require( "../images/matricula.png" );
    return (
        <View>
            <View style={ { flexDirection: "row" } }>
                <View style={ { width: "25%", marginTop: 10 } }>
                    <ImageIconWithdpiVariable
                        resizeMode="contain"
                        customStyleImage={ styles.image }
                        customStyleContainer={ styles.imageContainer }
                        source={ icon }
                        size="medium"
                    />
                </View>
                <View style={ { marginTop: 10, width: "65%" } }>
                    <TextWithdpiVariable style={ styles.title } fontSize="medium">
                        {notification.title}
                    </TextWithdpiVariable>
                    <TextWithdpiVariable style={ styles.message } fontSize="small">
                        {notification.message}
                    </TextWithdpiVariable>
                    <TextWithdpiVariable style={ styles.url } fontSize="mini">
                        {notification.linkLabel}
                    </TextWithdpiVariable>
                    <TextWithdpiVariable style={ styles.date } fontSize="mini">
                        {notification.created}
                    </TextWithdpiVariable>
                </View>
            </View>
            <HR />
        </View>
    );
};
NotificationInfo.propTypes = {
    notificationDescription: PropTypes.object,
    viewScreen: PropTypes.func,
};
export default NotificationInfo;
