import React from "react";
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";

const Typebutton = ( {
    active, text
} ) => (
    <View style={ { flexDirection: "row", alignItems: "center" } }>
    {active && (
        <Image
            resizeMode="contain"
            source={ require( "../images/check.png" ) }
            style={ [
                {
                    width: 20,
                    height: 10,
                },

                { tintColor: text === "Sin deuda" ? "#FFFF" : null },
            ] }
        />
    )}
        <Text
            style={ [
                {
                    textAlignVertical: "center",
                    marginLeft: active ? 0 : 15,
                },
                {
                    color: active && text === "Sin deuda" ? "#FFFF" : "#47525E",
                },
            ] }
        >
            {text}
        </Text>
    </View>
);

Typebutton.propTypes = {
    text: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
};

export default Typebutton;
