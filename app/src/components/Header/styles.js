import { StyleSheet, Platform } from "react-native";

import { colors } from "../../config/styles";

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: "center",
        height: 45,
        backgroundColor: colors.$blue,
    },
    statusBarIosWrapper: {
        height: 20,
        backgroundColor: colors.$blue,
        position: "absolute",
        top: Platform.OS === "ios" ? -20 : -10,
        left: 0,
        right: 0,
    },
    headerImage: {
        alignSelf: "center",
        marginTop: 0,
        height: 45,
    },
    notificationImage: {
        alignSelf: "center",
        marginTop: 0,
        height: 15,
        width: 15,
        tintColor: "#ffff",
    },
} );

export default styles;
