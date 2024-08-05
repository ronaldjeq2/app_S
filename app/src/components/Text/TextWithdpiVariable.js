import React from "react";
import {
    Text, Dimensions, Platform, PixelRatio,
} from "react-native";
import PropTypes from "prop-types";

import { colors } from "../../config/styles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get( "window" );

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize( size ) {
    const newSize = size * scale;
    if ( Platform.OS === "ios" ) {
        return Math.round( PixelRatio.roundToNearestPixel( newSize ) );
    }
    return Math.round( PixelRatio.roundToNearestPixel( newSize ) ) - 2;
}

const fontStyles = {
    mini: {
        fontSize: normalize( 10 ),
    },
    small: {
        fontSize: normalize( 12 ),
    },
    medium: {
        fontSize: normalize( 14 ),
    },
    large: {
        fontSize: normalize( 20 ),
    },
    xlarge: {
        fontSize: normalize( 24 ),
    },
};

const TextWithdpiVariable = ( { style, fontSize, children } ) => (
    <Text style={ { ...fontStyles[ fontSize ], ...style } }>{children}</Text>
);

TextWithdpiVariable.propTypes = {
    customStyle: PropTypes.object,
    fontSize: PropTypes.string.isRequired,
};
export default TextWithdpiVariable;
