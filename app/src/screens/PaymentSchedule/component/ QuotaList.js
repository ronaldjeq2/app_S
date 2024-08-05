import React, { PureComponent } from "react";
import { View, Text, Dimensions } from "react-native";
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import PropTypes from "prop-types";
import { colors } from "../../../config/styles";
import style from "../styles";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
const DEVICE_HEIGHT = Dimensions.get( "window" ).height;

const styles = {
    infoMounts: {
        height: DEVICE_HEIGHT * 0.12,
        alignItems: "center",
        flexDirection: "row",
        marginTop: 1,
    },
    containerPay: {
        flexDirection: "row",
        width: "80%",
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
    datePay: {
        alignItems: "center",
        width: DEVICE_WIDTH * 0.1,
        height: DEVICE_HEIGHT * 0.07,
        borderRadius: 100,
        backgroundColor: "#D3D9E0",
        marginLeft: 10,
        justifyContent: "center",
    },
    date: { color: colors.$lightBlue, fontSize: 12 },
    mount: {
        marginRight: 20,
        fontWeight: "bold",
    },
};


const QuotaList = ( {
    mount, title, fecha, state, debe, deuda,
} ) => {
    const fechaD = fecha.split( "/" )[ 0 ];
        const fechaL = `${ fecha.split( "/" )[ 1 ] }/${ fecha.split( "/" )[ 0 ] }/${ fecha.split( "/" )[ 2 ] }`;
        const fechaM = fnsFormat( fechaL, "MMM", {
            locale: fnsESLocale,
        } ).toUpperCase();
        let colorText;
        const colorTextDeuda = debe ? "#FFBF34" : "#13CE66";
        colorText = !debe && deuda > 0 ? "#525B6B" : colorTextDeuda;

    return (
            <View style={ styles.infoMounts }>
                <View style={ styles.containerPay }>
                    <View style={ styles.datePay }>
                        <Text style={ styles.date }>{fechaM}</Text>
                        <Text style={ [ styles.date, { fontWeight: "bold" } ] }>{fechaD}</Text>
                    </View>
                    <View style={ { marginLeft: 10 } }>
                        <Text style={ { fontSize: 16, fontWeight: "bold" } }>{title}</Text>
                        <Text style={ { fontSize: 14 } }>{state}</Text>
                    </View>
                </View>

                <Text
                    style={ [
                        style.mount,
                        {
                            color: colorText,
                        },
                    ] }
                >
                    {mount}
                </Text>
            </View>
    );
};

QuotaList.propTypes = {
    mount: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    debe: PropTypes.bool.isRequired,
    deuda: PropTypes.number.isRequired,
};

export default QuotaList;
