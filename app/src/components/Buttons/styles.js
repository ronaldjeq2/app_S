import { Dimensions, StyleSheet, Platform } from "react-native";

import { colors } from "../../config/styles";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const ORIENTATION_PORTRAIT = DEVICE_HEIGHT > DEVICE_WIDTH;
const SIZE = 50;

export default StyleSheet.create({
    iconContainer: {
        alignItems: "center",
        width: (ORIENTATION_PORTRAIT ? DEVICE_WIDTH : DEVICE_HEIGHT) / 3,
        marginBottom: 20,
    },

    icon: {
        marginBottom: 5,
    },
    iconDisable: {
        marginBottom: 5,
        tintColor: colors.$gray,
    },
    buttonWrapper: {
        height: SIZE,
        backgroundColor: colors.$senatiBlue,
        justifyContent: "center",
        borderRadius: 15,
        marginTop: Platform.OS === "ios" ? 25 : 10,
    },
    buttonWrapperDisabled: {
        backgroundColor: colors.$gray,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.$senatiWhite,
        textAlign: "center",
        width: "100%",
    },
    backButton: {},
    backButtonImage: {
        height: 27,
    },
});
