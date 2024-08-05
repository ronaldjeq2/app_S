import React from "react";
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import Item from "./Item";
import styles from "./styles";

const BirthdayGreeting = ( { today } ) => (
    <View style={ styles.birthdayGreeting }>
        <Image resizeMode="contain" source={ require( "./images/party-popper.png" ) } />
        <Text style={ styles.messagebirthday }>¡Feliz Cumpleaños!</Text>
        <Text>{`Cumpleaños de hoy ${ today }`}</Text>
    </View>
);

const DefaultGreeting = () => (
    <View style={ styles.birthdayGreeting }>
        <Text style={ styles.messagebirthday }>SIN CUMPLEAÑOS POR HOY</Text>
        <Text style={ { paddingBottom: 10 } }>Hoy guardamos las tortas</Text>
        <Text>Puedes revisar los cumpleaños de los siguientes meses</Text>
    </View>
);

const Greeting = ( {
    listhbirthday, today
} ) => {
    return (
        <View style={ styles.greetingContainer }>
            {listhbirthday.length === 0 ? (
                <DefaultGreeting />
            ) : (
                <BirthdayGreeting today={ today } />
            )}
            <View>
                <View style={ styles.birthdayGreetingList }>
                    {listhbirthday.map( item => (
                        <Item key={ item.studentId } item={ item } isActive />
                    ) )}
                </View>
            </View>
        </View>
    );
};

Greeting.propTypes = {
    listhbirthday: PropTypes.array.isRequired,
    today: PropTypes.string.isRequired,

};

export default Greeting;

