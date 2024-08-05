import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

const style = {
    container: { alignItems: "center", flexDirection: "row" },
    assistanceContainer: {
        backgroundColor: "#13CE66",
        marginVertical: 20,
        height: 55,
        justifyContent: "center",
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
    faultsContainer: {
        backgroundColor: "#3A4357",
        marginVertical: 20,
        height: 55,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
    porcentAssistance: {
        fontSize: 25,
        marginLeft: 30,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    assistanceText: {
        marginLeft: 30,
        color: "#FFFFFF",
    },
    containerText: {
        top: 20,
        justifyContent: "center",
        position: "absolute",
        alignItems: "center",
    },
};
function AssistancePorcent( classAssistance, assistance, notRegistered ) {
    if ( classAssistance + notRegistered === 0 ) {
        return 0;
    }
    return ( assistance / ( classAssistance + notRegistered ) ) * 100;
}
const AttendancesPercentage = ( { item } ) => {
    const { classAssistance, assistance, notRegistered } = item;

    const porcent = Math.round( AssistancePorcent( classAssistance, assistance, notRegistered ) );
    const lengthAssistance = Math.round( ( 300 * porcent ) / 100 );
    const borderGreen = porcent === 100 ? 5 : 0;
    const borderGray = porcent === 0 ? 5 : 0;

    return (
        <View style={ style.container }>
            <View
                style={ [
                    style.assistanceContainer,
                    {
                        width: lengthAssistance,
                        borderBottomRightRadius: borderGreen,
                        borderTopRightRadius: borderGreen,
                    },
                ] }
            />
            <View
                style={ [
                    style.faultsContainer,
                    {
                        width: 300 - lengthAssistance,
                        borderBottomLeftRadius: borderGray,
                        borderTopLeftRadius: borderGray,
                    },
                ] }
            />
            <View style={ style.containerText }>
                <Text style={ style.porcentAssistance }>{`${ porcent }%`}</Text>
                <Text style={ style.assistanceText }>Asistencias</Text>
            </View>
        </View>
    );
};

AttendancesPercentage.propTypes = {
    item: PropTypes.object,
};
export default AttendancesPercentage;
