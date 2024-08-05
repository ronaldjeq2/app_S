import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";

import Item from "./Item";

import styles from "./styles";

const months = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SETIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
];

const Upcoming = ( {
    listnothappybirthday, isActivebirthday
} ) => {
    const getUpcomingList = ( birthdayList, index ) => Object.values( birthdayList[ index ] );

    return (
        <View style={ styles.upcomingContainer }>
                {Object.keys( listnothappybirthday )
                    .sort()
                    .map( index => (
                        <View key={ months[ index - 1 ] } style={ styles.upcomingMonth }>
                            <View style={ styles.upcomingHeader }>
                                <Text style={ styles.monthText }>{months[ index - 1 ]}</Text>
                            </View>
                            {getUpcomingList( listnothappybirthday, index ).map( item => (
                                <Item key={ item.studentId } isActive={ false } item={ item } />
                            ) )}
                        </View>
                    ) )}
        </View>
    );
};

Upcoming.propTypes = {
    listnothappybirthday: PropTypes.object.isRequired,
    isActivebirthday: PropTypes.bool.isRequired,
};

export default Upcoming;


