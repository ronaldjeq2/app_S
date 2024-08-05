import { StyleSheet, Dimensions, Platform } from "react-native";

import { colors } from "../../config/styles";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;

export default StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: colors.$blue,
    },
    WebView: {
        backgroundColor: colors.$white,
    },
    headerContainer: {
        backgroundColor: "#274187",
        shadowColor: "black",
        shadowOpacity: 0,
        shadowRadius: 0.5,
        elevation: 4,
        height: 56,
        justifyContent: "center",
    },
    headerContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: Platform.OS === "ios" ? 15 : 0,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        color: colors.$white,
        textAlign: "center",
    },
    headerLeftTitle: {
        color: colors.$white,
        fontSize: 18,
        textAlign: "center",
        padding: 10,
    },
    headerRight: {
        marginRight: 5,
    },
    headerButtons: {
        width: 60,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    errorContainer: {
        flex: 1,
        backgroundColor: colors.$white,
        alignItems: "center",
        marginHorizontal: 15,
    },
    errorImageWrapper: {
        paddingVertical: 20,
        width: DEVICE_WIDTH * 0.65,
        height: DEVICE_WIDTH * 0.65,
        alignItems: "center",
        justifyContent: "center",
    },
    errorImage: {
        width: DEVICE_WIDTH * 0.65,
        height: DEVICE_WIDTH * 0.65,
    },
    errorTitle: {
        color: colors.$blue,
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 10,
    },
    errorMessage: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 25,
        fontWeight: "100",
    },
    errorButton: {
        height: 48,
        width: 180,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.$blue,
        borderRadius: 15,
        marginBottom: 15,
    },
    errorButtonSecondary: {
        backgroundColor: colors.$gray,
    },
    errorButtonText: {
        color: colors.$white,
        fontSize: 16,
        fontWeight: "600",
    },
} );
