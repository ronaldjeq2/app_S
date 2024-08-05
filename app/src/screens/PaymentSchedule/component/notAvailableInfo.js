import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { colors, THEME } from "../../../config/styles";

const style = {
    fontStyle: { fontWeight: "bold", color: colors.$gray },
};

const notAvailableInfo = ( { codPayment, period } ) => (
    <View>
        <View style={ { alignItems: "center", paddingHorizontal: 15, marginVertical: 25 } }>
            <Text style={ { fontSize: 15 } }>
                No hay información disponible, comunícate con tu centro de servicio para más detalle
            </Text>
        </View>
        <View style={ { alignItems: "center", marginBottom: 15, marginTop: 50 } }>
            <Text style={ style.fontStyle }>Periodo</Text>
            <Text style={ style.fontStyle }>{period}</Text>
        </View>
        <View style={ { alignItems: "center" } }>
            <Text style={ style.fontStyle }>Código de pago</Text>
            <Text style={ style.fontStyle }>{codPayment}</Text>
        </View>
    </View>
);
notAvailableInfo.propTypes = {
    codPayment: PropTypes.string,
    period: PropTypes.string,
};
export default notAvailableInfo;
