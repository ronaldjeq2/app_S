import React from "react";
import {
    View, Image, Text, Dimensions,
} from "react-native";
import style from "../../styles";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
const DEVICE_HEIGHT = Dimensions.get( "window" ).height;

const styles = {
    infoPay: {
        flexDirection: "row",
        backgroundColor: "#FFFF",
        height: DEVICE_HEIGHT * 0.2,
        marginBottom: 1,
    },
    imageReport: {
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
    },
    textReferencePay: {
        backgroundColor: "#FFFF",
        height: DEVICE_HEIGHT * 0.2,
        flex: 1,
    },
    textInfoPay: {
        marginTop: 10,
        marginLeft: 6,
        marginRight: 10,
        fontSize: 13,
    },
};

const InfoPay = ( ) => (
    <View style={ styles.infoPay }>
        <View style={ styles.imageReport }>
            <Image
                resizeMode="contain"
                source={ require( "../../images/report.png" ) }
                style={ { width: DEVICE_WIDTH * 0.3, marginRight: 20 } }
            />
        </View>
        <View style={ styles.textReferencePay }>
            <Text style={ [ styles.textInfoPay, { fontWeight: "bold" } ] }>
                {" Todos los pagos deben realizarse únicamente en los bancos del listado inferior"}
            </Text>
            <Text style={ styles.textInfoPay }>
                {
                    "Al momento de pagar, indica que el pago es en la cuenta de servicio Recaudación ALUMNOS"
                }
            </Text>
        </View>
    </View>
);

export default InfoPay;
