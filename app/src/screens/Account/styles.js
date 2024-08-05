import { StyleSheet } from "react-native";

import { colors, THEME } from "../../config/styles";

export default StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: colors.$white,
        paddingHorizontal: 0,
    },
    segmentWrapper: {
        flexDirection: "column",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    segmentTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.$lighterBlue,
        paddingVertical: 5,
    },
    optionList: {},
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 3,
        height: 48,
        // backgroundColor: "yellow",
    },
    optionLabel: {
        flex: 1,
        textAlignVertical: "center",
        fontSize: 16,
    },
    optionIconWrapper: {
        paddingHorizontal: 20,
    },
    optionIconLeft: {
        paddingLeft: 0,
    },
    optionIconRight: {
        paddingRight: 0,
    },
    optionIcon: {
        height: 25,
        width: 25,
        tintColor: colors.$lightBlue,
    },
    horizontalSeparator: {
        borderWidth: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: THEME.separatorColor,
    },
    footerText: {
        fontSize: 14,
        fontStyle: "italic",
        marginBottom: 10,
    },
    footerTextHighlighted: {
        color: colors.$lightBlue,
        fontWeight: "500",
    },
    buttonLogout: {
        paddingVertical: 10,
        // marginBottom: 10,
        // backgroundColor: "red",
    },
    buttonLogoutText: {
        color: THEME.buttonLogoutColor,
        fontSize: 16,
        fontWeight: "600",
    },
    infoStudent: {
        height: 110,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    imageperson: {
        marginLeft: 5,
        height: 80,
        width: 80,
    },
    logo: {
        marginTop: 5,
        marginLeft: 0,
        height: 120,
        width: 100,
        tintColor: colors.$lightBlue,
    },
    viewDate: {
        flex: 1,
        marginLeft: 25,
    },
    containerDates: {
        marginLeft: 25,
        marginBottom: 15,
    },
    textDate: {
        marginTop: 20,
    },
    emailPrincipal: {
        flexDirection: "row",
        marginTop: 20,
    },
    indicator: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
        marginRight: 15,
        width: 80,
        textAlign: "center",
        borderRadius: 6,
        backgroundColor: colors.$BlueIndicator,
    },
    textDatePrincipal: {
        fontSize: 15,
        flex: 1,
    },
    contentText: {
        marginTop: 15,
        height: 30,
        justifyContent: "center",
    },
    textitle: {
        marginTop: 20,
        fontWeight: "bold",
    },
    contentItems: {
        flexDirection: "row",
        marginTop: 20,
    },
    TitleItem: {
        width: 120,
        alignSelf: "center",
    },
    TextDate: {
        marginLeft: 20,
        flex: 1,
        marginRight: 10,
    },

    textDetailApp: {
        fontSize: 15,
        marginBottom: 10,
        justifyContent: "center",
    },
} );
