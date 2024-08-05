import React from "react";
import {
    Image, Dimensions, Platform, PixelRatio, View
} from "react-native";
import PropTypes from "prop-types";

import { colors } from "../../config/styles";

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

const styles = {
    imageContainer: {
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
    },
    mini: {
        image: { height: normalize(10) },
        containerImage: {
            height: normalize(18),
            width: normalize(18),
            borderRadius: normalize(12),
        }

    },
    small: {
        image: {
            height: normalize(13)
        },
        containerImage: {
            height: normalize(22),
            width: normalize(22),
            borderRadius: normalize(15),
        }

    },
    medium: {
        image: { height: normalize(16) },
        containerImage: {
            height: normalize(28),
            width: normalize(28),
            borderRadius: normalize(20),
        }



    },
    large: {
        image: { height: normalize(20) },
        containerImage: {
            height: normalize(33),
            width: normalize(33),
            borderRadius: normalize(30),
        }


    },
    xlarge: {
        image: { height: normalize(24) },
        containerImage: {
            height: normalize(42),
            width: normalize(42),
            borderRadius: normalize(34),
        }


    },
};

const ImageIconWithdpiVariable = ({ customStyleContainer, customStyleImage, size, resizeMode, source, children }) => (
    <View style={{ ...styles.imageContainer, ...styles[size].containerImage, ...customStyleContainer }} >
        <Image
            resizeMode={resizeMode}
            source={source}
            style={{ ...styles[size].image, ...customStyleImage }} />
    </View>

);

ImageIconWithdpiVariable.propTypes = {
    size: PropTypes.string.isRequired,
    customStyleImage: PropTypes.object,
    resizeMode: PropTypes.string.isRequired,
    source: PropTypes.number.isRequired,
    customStyleContainer: PropTypes.object,

};
export default ImageIconWithdpiVariable;
