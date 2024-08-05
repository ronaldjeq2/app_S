import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

const style = {
    assistanceContainer: {
        width: 270,
        justifyContent: "center",
        marginRight: 30,
        flexDirection: "row",
    },

    assistanceText: {
        width: "60%",
        height: 20,
        marginLeft: 30,
        fontWeight: "bold",
    },
    assistanceDetail: {
        width: "15%",
        height: 20,
        marginLeft: 10,
        textAlign: "center",
    },
    separator: {
        backgroundColor: "#E9E9EF",
        height: 30,
        width: 1,
        marginHorizontal: 10,
    },
};

const DetailSpecific = ( { Type, number, numberColor } ) => (
    <View style={ style.assistanceContainer }>
        <Text style={ style.assistanceText }>{Type}</Text>
        <View style={ style.separator } />
        <Text style={ [ style.assistanceDetail, { color: numberColor } ] }>{number}</Text>
    </View>
);

DetailSpecific.propTypes = {
    Type: PropTypes.string,
    number: PropTypes.number,
    numberColor: PropTypes.string,
};
export default DetailSpecific;
