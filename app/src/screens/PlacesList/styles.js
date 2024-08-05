import { StyleSheet } from "react-native";
import Dimensions from "Dimensions";
import { colors } from "../../config/styles";

const DEVICE_WIDTH = Dimensions.get("window").width;
export default StyleSheet.create({
    searchInputView: {
        margin: 10,
        padding: Platform.OS === "ios" ? 15 : 0,
        backgroundColor: "#fff",
        borderRadius: 5,
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
    textInput: {
        borderColor: "transparent",
        paddingLeft: 45,
    },
    item: {
        padding: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
    },
    info: {
        flex: 1,
    },
    arrow: {
        width: 11,
        height: 18,
        marginRight: 10,
        tintColor: colors.$lightBlue,
        marginLeft: 10
    },
    textSee: {
        color: colors.$senatiBlue
    },
    container: {
        padding: 10,
    },
    title: {
        color: colors.$senatiBlue,
        fontSize: 14,
        fontWeight: "bold",
    },

    subTitle: {
        color: "#5A6978",
        fontSize: 11,
        fontWeight: "100",
    },
});
