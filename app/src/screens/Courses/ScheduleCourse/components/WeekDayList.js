import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import WeekDay from "./Weekday";

const ALL_DAYS = [ "L", "M", "X", "J", "V", "S", "D" ];

const styles = {
    weekDayList: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
};

const isActiveDay = ( currentDay, activeDays ) => {
    const isActive = activeDays.indexOf( currentDay ) !== -1;
    return isActive;
};

const WeekDayList = ( { activeDays = [] } ) => (
    <View style={ styles.weekDayList }>
        {ALL_DAYS.map( currentDay => (
            <WeekDay
                key={ currentDay }
                weekDay={ currentDay }
                isActive={ isActiveDay( currentDay, activeDays ) }
            />
        ) )}
    </View>
);

WeekDayList.propTypes = {
    activeDays: PropTypes.arrayOf( PropTypes.string ),
};

export default WeekDayList;
