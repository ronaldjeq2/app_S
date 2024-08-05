import React from "react";
import {
    Text, View, Dimensions, Image, TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import { colors } from "../../../../config/styles";

const DEVICE_HEIGHT = Dimensions.get( "window" ).height;

const styles = {
    chooseButton: {
        height: 15,
        tintColor: colors.$lightBlue,
    },

    textBank: {
        marginLeft: 10,
    },

    infoBank: {
        backgroundColor: "#FFFF",
        height: DEVICE_HEIGHT * 0.12,
        justifyContent: "center",
        marginTop: 2,
    },

    separatorText: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    messageCopy: {
        color: "red",
        fontSize: 10,
    },
};

const DetailBank = ( {
    detailBank, bankSelected, onPress 
} ) => (
    <TouchableOpacity onPress={ onPress } style={ styles.infoBank }>
        <Text style={ styles.textBank }>Banco preferido y datos importantes</Text>
        <View style={ styles.separatorText }>
            <Text style={ styles.textBank }>{bankSelected}</Text>
            <Image
                resizeMode="contain"
                source={ require( "../../images/chevron-right.png" ) }
                style={ styles.chooseButton }
            />
        </View>
        <Text style={ [ styles.textBank, { color: "#969FAA" } ] }>{detailBank}</Text>
    </TouchableOpacity>
);

DetailBank.propTypes = {
    onPress: PropTypes.func.isRequired,
    detailBank: PropTypes.string.isRequired,
    bankSelected: PropTypes.string.isRequired,
};

export default DetailBank;
