import React from "react";
import {
    View, Text, Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { colors } from "../../../../config/styles";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
const DEVICE_HEIGHT = Dimensions.get( "window" ).height;
const styles = {
    periodo: {
        marginLeft: 10,
        color: colors.$senatiWhite,
    },
    containinfoCouta: {
        flex: 1,
        backgroundColor: colors.$lightBlue,
        justifyContent: "center",
    },

    infoMountTotal: {
        width: 140,
        height: 60,
        backgroundColor: "#D3D9E0",
        justifyContent: "center",
        alignItems: "center",
    },
    textMount: {
        marginLeft: 10,
        color: "#3A4357",
    },
    mountTotal: {
        marginLeft: 10,
        color: colors.$lightBlue,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
    },
    infoContain: {
        backgroundColor: "#FFFF",
        height: DEVICE_HEIGHT * 0.12,
        justifyContent: "center",
        alignItems: "center",
    },
    infoContainCurrentPayment: {
        backgroundColor: "#FFFF",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
};
function changeColor( valueIsTrue ) {
    const color = valueIsTrue ? "#FFBF34" : "#13CE66";
    return color;
}

const HeaderPeriod = ( { item = {}, period = null } ) => {
    const { debt, state, mountTotal } = item;
    return (
        <View style={ { flexDirection: "row" } }>
            <View style={ styles.containinfoCouta }>
                <Text style={ styles.periodo }>{`PERIODO ${ period }`}</Text>
                <Text
                    style={ {
                        marginLeft: 10,
                        color: changeColor( debt > 0 ),
                    } }
                >
                    {`Estado: ${ state }`}
                </Text>
            </View>
            <View style={ styles.infoMountTotal }>
                <Text style={ styles.textMount }>Total del Periodo</Text>
                <Text style={ styles.mountTotal }>{`S/.${ mountTotal }`}</Text>
            </View>
        </View>
    );
};

const CurrentPayment = ( { item = {} } ) => {
    const { currentPayment } = item;
    const {
        tittle, dueDate, mount, debt,
    } = currentPayment;
    return (
        <View style={ styles.infoContainCurrentPayment }>
            <Text>{tittle}</Text>
            <Text style={ styles.mountTotal }>{` S/. ${ mount } `}</Text>
            <Text style={ { color: changeColor( debt ) } }>{` Fecha vencimiento ${ dueDate } `}</Text>
        </View>
    );
};

HeaderPeriod.propTypes = {
    item: PropTypes.object,
    period: PropTypes.string,
};

CurrentPayment.propTypes = {
    item: PropTypes.object,
};
export { HeaderPeriod, CurrentPayment };
