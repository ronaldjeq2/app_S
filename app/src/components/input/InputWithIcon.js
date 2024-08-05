import React, { PureComponent } from "react";
import {
    TextInput, View, Image, TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

import styles from "./styles";
import { colors } from "../../config/styles";

class InputWithIcon extends PureComponent {
    static propTypes = {
        imageIcon: PropTypes.number.isRequired,
        rightButton: PropTypes.shape( {
            active: PropTypes.bool,
            icon: PropTypes.number,
            onPress: PropTypes.func,
        } ),
    };

    constructor( props ) {
        super( props );
        this.textInputRef = null;
    }

    render() {
        const { imageIcon, rightButton } = this.props;
        return (
            <View style={ styles.container }>
                <View style={ [ styles.iconWrapper, styles.iconWrapperLeft ] }>
                    <Image resizeMode="contain" source={ imageIcon } style={ styles.icon } />
                </View>
                <TextInput
                    style={ [ styles.input, styles.inputIcon ] }
                    underlineColorAndroid="transparent"
                    { ...this.props }
                    ref={ ( ref ) => {
                        this.textInputRef = ref;
                    } }
                />
                {rightButton
                    && rightButton.icon && (
                    <TouchableOpacity
                        onPress={ rightButton.onPress }
                        style={ [ styles.iconWrapper, styles.iconWrapperRight ] }
                        disabled={ rightButton.disabled }
                    >
                        <Image
                            resizeMode="contain"
                            source={ rightButton.icon }
                            tintColor={ rightButton.active ? colors.$lightBlue : colors.$gray }
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

InputWithIcon.defaultProps = {
    rightButton: {
        icon: null,
        active: false,
        disabled: false,
        onPress: null,
    },
};

export default InputWithIcon;
