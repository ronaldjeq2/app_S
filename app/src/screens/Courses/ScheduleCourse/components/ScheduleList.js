import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

import WeekDay from "./Weekday";
import { HR } from "../../../../components";

import { colors } from "../../../../config/styles";

const WEEK_DAYS = {
    L: "Lunes",
    M: "Martes",
    X: "Miércoles",
    J: "Jueves",
    V: "Miercoles",
    S: "Sábado",
    D: "Domingo",
    "": "",
};

const ALL_WEEK_DAYS = [ "L", "M", "X", "J", "V", "S", "D", "" ];

const scheduleSchema = PropTypes.shape( {
    key: PropTypes.string.isRequired,
    weekDayList: PropTypes.arrayOf( PropTypes.string ).isRequired,
    classTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    instructor: PropTypes.string.isRequired,
} );

const styles = {
    scheduleItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
    },
    scheduleItemWeekDay: {
        width: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    scheduleItemTitle: {
        fontSize: 15,
    },
    scheduleItemSubTitle: {
        color: colors.$gray,
    },
};

const ScheduleItem = ( { schedule, weekDay } ) => {
    const SubTitleStyle = [ styles.scheduleItemSubTitle ];
    const ItemTittle = [ styles.scheduleItemTitle ];
    let separator = " | ";
    if ( weekDay === "" ) {
        SubTitleStyle.push( { marginLeft: 5 } );
        separator = "";
    }
    if ( !schedule.existData ) {
        ItemTittle.push( { fontWeight: "bold" } );
    }

    return (
        <View style={ styles.scheduleItem }>
            <View style={ styles.scheduleItemWeekDay }>
                <WeekDay weekDay={ weekDay } isActive={ weekDay !== "" } size="large" />
            </View>
            {schedule.existData && (
                <View>
                    <Text style={ styles.scheduleItemTitle }>
                        {`${ WEEK_DAYS[ weekDay ] }${ separator }${ schedule.classTime }`}
                    </Text>

                    <Text style={ SubTitleStyle }>{schedule.location}</Text>
                    <Text style={ SubTitleStyle }>{schedule.instructor}</Text>
                </View>
            )}

            {!schedule.existData && (
                <View>
                    <Text style={ styles.ItemTittle }>Sin información disponible</Text>
                </View>
            )}
        </View>
    );
};

ScheduleItem.propTypes = {
    schedule: scheduleSchema,
    weekDay: PropTypes.oneOf( ALL_WEEK_DAYS ),
};

const ScheduleList = ( { scheduleList = [] } ) => {
    let orderedScheduleList = [];
    for ( let i = 0; i < scheduleList.length; i += 1 ) {
        const schedule = scheduleList[ i ];

        for ( let j = 0; j < schedule.weekDayList.length; j += 1 ) {
            const weekDay = schedule.weekDayList[ j ];
            orderedScheduleList.push( {
                weekDay,
                ...schedule,
            } );
        }
    }

    orderedScheduleList = orderedScheduleList.sort(
        ( a, b ) => ALL_WEEK_DAYS.indexOf( a.weekDay ) - ALL_WEEK_DAYS.indexOf( b.weekDay ),
    );

    return (
        <View style={ styles.scheduleList }>
            <HR />
            {orderedScheduleList.map( schedule => (
                <ScheduleItem
                    key={ `${ schedule.weekDay }-${ schedule.key }` }
                    weekDay={ schedule.weekDay }
                    schedule={ schedule }
                />
            ) )}
        </View>
    );
};

ScheduleList.propTypes = {
    scheduleList: PropTypes.arrayOf( scheduleSchema ).isRequired,
};

export default ScheduleList;
