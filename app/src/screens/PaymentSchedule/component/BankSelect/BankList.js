import React from "react";
import PropTypes from "prop-types";
import {
    View, Image, Text, Dimensions, TouchableOpacity,
} from "react-native";

const DEVICE_HEIGHT = Dimensions.get( "window" ).height;

const styles = {
    infoMounts: {
        height: DEVICE_HEIGHT * 0.12,
        alignItems: "center",
        flexDirection: "row",
        marginTop: 1,
    },
    containerPay: {
        flexDirection: "row",
        width: "80%",
    },
};

const BankList = ( {
    detailBank = null, bankSelect = null, onPress, bank = null,
} ) => (
    <TouchableOpacity style={ styles.infoMounts } onPress={ onPress }>
        <View style={ [ styles.containerPay, { marginLeft: 10 } ] }>
            <View style={ { marginLeft: 10 } }>
                <Text style={ { fontSize: 16, fontWeight: "bold" } }>{bankSelect}</Text>
                <Text style={ { fontSize: 14 } }>{detailBank}</Text>
            </View>
        </View>
        <View style={ { flex: 1, alignItems: "center" } }>
            <Image
                resizeMode="contain"
                source={ require( "../../images/star.png" ) }
                style={ {
                    marginRight: 10,
                    tintColor: bankSelect === bank ? "#0E5BE3" : "#D3D9E0",
                } }
            />
        </View>
    </TouchableOpacity>
);

BankList.propTypes = {
    detailBank: PropTypes.string,
    bankSelect: PropTypes.string,
    bank: PropTypes.string,
    onPress: PropTypes.func,
};

export default BankList;
