import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
    View, Text, TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { BackButton } from "../../../components/Buttons";
import { colors } from "../../../config/styles";
import styles from "../../Sinfo/styles";

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
    headerOptions: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 150,
    },
};

const Header = ( { onRightSwitchPress,onLeftButtonPress,twoFotocheck,carnetChangue,headerHeight } ) => (
            <SafeAreaView style={ [ style.headerContainer, { height: headerHeight } ] }>
                            {/* LEFT SECTION */}
                            <TouchableOpacity
                                onPress={ onLeftButtonPress }
                                style={ [ style.headerButtons, styles.headerLeft ] }
                            >
                                <BackButton />
                            </TouchableOpacity>

                            <Text style={ style.headerTitle }>Fotocheck</Text>

                            {/* RIGHT SECTION */}
                            {twoFotocheck && (
                                <View style={ style.headerOptions }>
                                    <Text
                                        onPress={ onRightSwitchPress }
                                        style={ {
                                            color: colors.$white,
                                        } }
                                    >
                                        Cambiar a
                                        {" "}
                                        {carnetChangue}
                                    </Text>
                                </View>
                            )}
            </SafeAreaView>
);

Header.propTypes = {
        onRightSwitchPress: PropTypes.func.isRequired,
        onLeftButtonPress: PropTypes.func.isRequired,
        twoFotocheck: PropTypes.bool.isRequired,
        headerHeight: PropTypes.number.isRequired,
};

export default Header;