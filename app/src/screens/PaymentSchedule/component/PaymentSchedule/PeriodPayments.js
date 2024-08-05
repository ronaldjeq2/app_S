import React from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../../../../config/styles";
import QuotaList from "../ QuotaList";
import { HR } from "../../../../components";

const styles = {
    mountCancelateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 3,
        marginTop: 4,
        backgroundColor: "#D3D9E0",
        height: 35,
        alignItems: "center",
    },

    textBank: {
        marginLeft: 10,
    },

    textmountCancelate: {
        marginLeft: 10,
        marginRight: 20,
        color: colors.$lightBlue,
        fontWeight: "bold",
    },
    containerWithoutInfo: {
        height: 60,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },

    textWithoutInfo: {
        fontSize: 20,
        textAlignVertical: "center",
    },
};


const PeriodPayments = ( {
    mountCanceled, listPayments 
} ) => (
    <View style={ { flex: 1 } }>
    {/* Monto de cuotas canceladas del periodo */}
    <View style={ styles.mountCancelateContainer }>
        <Text style={ styles.textBank }>Monto Cancelado</Text>
        <Text style={ styles.textmountCancelate }>{`s./ ${ mountCanceled }`}</Text>
    </View>
    {/* Listado de info de todas las cuotas del periodo */}
    {listPayments.length === 0 && (
        <View style={ styles.containerWithoutInfo }>
            <Text style={ styles.textWithoutInfo }>
                {"No hay información disponible"}
            </Text>
        </View>
    )}

    {listPayments.map( item => (
        <View key={ item.keyPayment }>
            <QuotaList
                fecha={ item.dueDate }
                title={ item.tittle }
                mount={ `s/. ${ item.mount }` }
                state={ item.state }
                debe={ item.debt }
                deuda={ parseFloat( item.balance ) }
            />
            <HR />
        </View>
    ) )}
    </View>
);

PeriodPayments.propTypes = {
    mountCanceled: PropTypes.string.isRequired,
    listPayments: PropTypes.array.isRequired,
};

export default PeriodPayments;
