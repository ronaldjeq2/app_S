import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

import WeekDay from "../../ScheduleCourse/components/Weekday";
import { colors } from "../../../../config/styles";

const style = {
    container: { flex: 1, marginVertical: 15 },
    tittle: {
        marginLeft: 20,
        fontSize: 12,
        color: colors.$lighterBlue,
        fontWeight: "bold",
        marginBottom: 5,
    },
    Detail: {
        marginHorizontal: 30,
        flexDirection: "row",
    },
    textDay: {
        width: 80,
    },
    textNull: {
        marginTop: 5,
        marginHorizontal: 20,
        alignSelf: "center",
    },
};
const AssitanceStatus = ( { tittle, nrcList } ) => (
    <View style={ style.container }>
        <Text style={ style.tittle }>{tittle}</Text>
        {Object.values( nrcList ).map( item => (
            <View
                key={ item.assistanceDate }
                style={ {
                    alignItems: "center",
                    marginVertical: 15,
                    flexDirection: "row",
                    marginHorizontal: 20,
                } }
            >
                <WeekDay weekDay={ item.dayShort } isActive size="short" />
                {/* <Text style={ style.Detail }>{`${ item.dayName } | ${ item.assistanceDate }`}</Text> */}
                <View style={ style.Detail }>
                    <Text style={ style.textDay }>{`${ item.dayName }`}</Text>
                    <Text style={ style.textDay }>{`${ item.assistanceDate }`}</Text>
                </View>
            </View>
        ) )}
        {Object.values( nrcList ).length === 0 && (
            <Text style={ style.textNull }>No hay registros</Text>
        )}
    </View>
);

AssitanceStatus.propTypes = {
    tittle: PropTypes.string,
    nrcList: PropTypes.object,
};

export default AssitanceStatus;
