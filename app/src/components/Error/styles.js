import { StyleSheet } from "react-native";

const styles = StyleSheet.create( {
    errorWrapper: {
        padding: 5,
        height: 25,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    errorText: {
        fontSize: 12,
        color: "white",
        fontWeight: "bold",
        justifyContent: "space-between",
    },
    indicator: {
        flex: 1,
    },
} );

export default styles;
