import React from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";

import { colors } from "../../../../config/styles";

/**
 * Rounded view which indicates the scheduled weekday of the class
 */

const styles = {
    weekDay: {
        backgroundColor: "#D3D9E0",
        width: 35,
        height: 35,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    weekDayText: {
        fontSize: 18,
        fontWeight: "600",
    },
};

const WeekDay = ( { isActive = false, weekDay = "L", size = "normal" } ) => {
    const weekDayStyle = [ styles.weekDay ];
    const weekDayTextStyle = [ styles.weekDayText ];

    if ( isActive ) {
        weekDayStyle.push( { backgroundColor: colors.$lightBlue } );
        weekDayTextStyle.push( { color: colors.$white } );
    }

    if ( size === "large" ) {
        weekDayStyle.push( { width: 45, height: 45 } );
        weekDayTextStyle.push( { fontSize: 27 } );
    }

    if ( size === "short" ) {
        weekDayStyle.push( { width: 25, height: 25 } );
        weekDayTextStyle.push( { fontSize: 15 } );
    }

    return (
        <View style={ weekDayStyle }>
            <Text style={ weekDayTextStyle }>{weekDay}</Text>
        </View>
    );
};

WeekDay.propTypes = {
    // When is true change the background color
    isActive: PropTypes.bool,

    // Single character indicator of weekDay
    weekDay: PropTypes.oneOf( [ "L", "M", "X", "J", "V", "S", "D", "" ] ),

    // the size of the weekDay circle
    size: PropTypes.oneOf( [ "normal", "large", "short" ] ),
};

export default WeekDay;
