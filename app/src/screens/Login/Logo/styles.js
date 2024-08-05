import { Dimensions, StyleSheet, Platform } from "react-native";
import { colors } from "../../../config/styles";

const imageWidth = Dimensions.get( "window" ).width / 2;

export const imageSizes = {
    $smallImageSize: imageWidth / 2,
    $largeImageSize: imageWidth,
};

export default StyleSheet.create( {
    container: {
        alignItems: "center",
        backgroundColor: colors.$senatiBlue,
    },
    containerImage: {
        alignItems: "center",
        justifyContent: "center",
        width: imageWidth,
        height: imageSizes.$largeContainerSize,
        marginTop: Platform.OS === "ios" ? 10 : 0,
    },
} );
