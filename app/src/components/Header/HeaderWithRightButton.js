import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import { BackButton } from "../Buttons";
import { colors } from "../../config/styles";
// import Search from "../Search";

const style = {
    headerContainer: {
        backgroundColor: "#274187",
        shadowColor: "black",
        shadowOpacity: 0,
        shadowRadius: 0.5,
        elevation: 4,
        height: 56,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
    },

    headerButtons: {
        width: 60,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.$white,
        textAlign: "center",
    },
};


const HeaderWithRightButton = ({
    onRightButtonPress, onLeftButtonPress, imageIcon, headerTittle
}) => (
        <SafeAreaView style={style.headerContainer}>
            {/* LEFT SECTION */}
            <TouchableOpacity onPress={onLeftButtonPress} style={style.headerButtons}>
                <BackButton />
            </TouchableOpacity>

            <Text style={style.headerTitle}>{headerTittle}</Text>

            {/* RIGHT SECTION */}
            <TouchableOpacity onPress={onRightButtonPress} style={style.headerButtons}>
                <Image
                    resizeMode="contain"
                    source={imageIcon}
                    style={{
                        height: 27,
                        tintColor: colors.$senatiWhite,

                    }}
                />
            </TouchableOpacity>
        </SafeAreaView>
    );

HeaderWithRightButton.propTypes = {
    onRightButtonPress: PropTypes.func,
    onLeftButtonPress: PropTypes.func.isRequired,
    imageIcon: PropTypes.number,
    headerTittle: PropTypes.string.isRequired,
};

export default HeaderWithRightButton;
