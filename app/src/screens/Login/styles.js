import { StyleSheet, Dimensions, Platform } from "react-native";

import { colors, THEME } from "../../config/styles";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const VERTICAL_BREAKPOINT = WINDOW_HEIGHT <= 600;
const HEADER_HEIGHT = VERTICAL_BREAKPOINT ? WINDOW_HEIGHT * 0.4 : WINDOW_HEIGHT * 0.5;
const LOGO_MARGIN_TOP = Platform.OS === "ios" ? 10 : 0;
const INPUT_SIZE = 48;
const BUTTON_SIZE = 50;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.$white,
        height: WINDOW_HEIGHT,
    },
    header: {
        backgroundColor: colors.$blue,
        height: HEADER_HEIGHT,
        width: WINDOW_WIDTH,
    },
    headerImage: {
        flex: 1,
        width: WINDOW_WIDTH * 0.45,
        height: WINDOW_WIDTH * 0.45,
        justifyContent: "center",
        alignSelf: "center",
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
    },
    buttonMap: {
        flex: 1,
        marginTop: 30,
        backgroundColor: 'red'
    },
    contentBackgroundImage: {
        position: "absolute",
        marginTop: LOGO_MARGIN_TOP,
        top: HEADER_HEIGHT + INPUT_SIZE * 2 + BUTTON_SIZE + LOGO_MARGIN_TOP + 10,
        left: 0,
        right: 0,
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH,
    },
    footer: {
        position: "absolute",
        bottom: 10,
    },
    footerText: {
        fontSize: 14,
        paddingLeft: 8,
        paddingBottom: 5,
    },
    errorWrapper: {
        padding: 10,
        backgroundColor: THEME.errorBackgroundColor,
    },
    errorText: {
        fontSize: 12,
        color: THEME.errorTextColor,
        fontWeight: "400",
    },
});

export default styles;
