import React, { PureComponent } from "react";
import { View, Image, Text } from "react-native";
import PropTypes from "prop-types";
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import styles from "./styles";

function birthdayNewFormat( data ) {
    const daysegment = data.split( "/" );
    return daysegment;
}

const Item = ( {
    isActive, item
} ) => {
    const personImageStyle = [ styles.personImage ];
    const birthday = birthdayNewFormat( item.birthdate_string );
    const numberMonth = parseInt( birthday[ 1 ] ) - 1;
    const DayName = fnsFormat( new Date( birthday[ 2 ], numberMonth, birthday[ 0 ] ), "dddd", {
        locale: fnsESLocale,
    } ).toUpperCase();
    const DayNumber = fnsFormat( new Date( birthday[ 2 ], numberMonth, birthday[ 0 ] ), "DD", {
        locale: fnsESLocale,
    } ).toUpperCase();

    if ( isActive ) {
        personImageStyle.push( styles.personImageActive );
    }
    return (
        <View style={ styles.birthdayGreetingListItem }>
            <Image
                style={ personImageStyle }
                source={ require( "./images/circle-person-active.png" ) }
            />
            <View style={ styles.student }>
                <Text>
                    {" "}
                    {item.firstname}
                    {" "}
                    {item.middlename ? `${ item.middlename[ 1 ] }.` : ""}
                </Text>
                <Text>{item.lastname}</Text>
            </View>
            {isActive === false && (
                <View style={ styles.birthDateContainer }>
                    <Text style={ styles.birthDateDay }>{DayNumber}</Text>
                    <Text style={ styles.birthDateDayName }>{DayName}</Text>
                </View>
            )}
        </View>
    );
};

Item.propTypes = {
    item: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
};

export default Item;
