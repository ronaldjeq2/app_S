import { StyleSheet, Platform } from "react-native";

import { colors } from "../../config/styles";

export default StyleSheet.create( {
    container: {
        // flex: 1,
    },

    indicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    arrow: {
        width: 11,
        height: 18,
        marginRight: 10,
        tintColor: colors.$lightBlue,
    },

    searchInputView: {
        margin: 10,
        padding: Platform.OS === "ios" ? 15 : 0,
        backgroundColor: "#fff",
        borderRadius: 5,
    },

    textInput: {
        borderColor: "transparent",
        paddingLeft: 45,
    },

    inlineImg: {
        position: "absolute",
        zIndex: 99,
        width: 25,
        height: 25,
        left: 10,
        top: 10,
        tintColor: colors.$lightBlue,
    },

    item: {
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    info: {
        flex: 1,
    },
} );
