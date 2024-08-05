import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-navigation";
import PropTypes from "prop-types";

import { BackButton } from "../../components/Buttons";

import styles from "./styles";

const Header = ( { onRightButtonPress, isRightButtonDisabled, onLeftButtonPress, isLeftButtonDisabled,} ) => (
        <SafeAreaView style={ styles.headerContainer }>
            <View style={ styles.headerContent }>
                {/* LEFT SECTION */}
                <TouchableOpacity
                    onPress={ onLeftButtonPress }
                    disabled={ isLeftButtonDisabled }
                    style={ [ styles.headerButtons, styles.headerLeft ] }
                >
                    {!isLeftButtonDisabled && <BackButton />}
                </TouchableOpacity>

                <Text style={ styles.headerTitle }>SINFO</Text>

                {/* RIGHT SECTION */}

                <Text
                    onPress={ onRightButtonPress }
                    disabled={ isRightButtonDisabled }
                    style={ styles.headerLeftTitle }
                >
                    Cerrar
                </Text>
            </View>
        </SafeAreaView>
    );


Header.propTypes = {
    onRightButtonPress: PropTypes.func.isRequired,
    isRightButtonDisabled: PropTypes.bool,
    onLeftButtonPress: PropTypes.func.isRequired,
    isLeftButtonDisabled: PropTypes.bool.isRequired,
};

export default Header;


