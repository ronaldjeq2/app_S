import React, { PureComponent } from "react";
import { View, Image, Text } from "react-native";
import PropTypes from "prop-types";

import styles from "./styles";

class Gears extends PureComponent {
    static propTypes = {
        message: PropTypes.string,
    };

    render() {
        const { message } = this.props;
        return (
            <View style={ styles.container }>
                <View style={ styles.contentWrapper }>
                    <Image style={ styles.image } source={ require( "./images/gears.gif" ) } />
                    <Text style={ styles.message }>{message}</Text>
                </View>
            </View>
        );
    }
}

export default Gears;
