import { StyleSheet, Platform } from "react-native";

import { colors } from "../../config/styles";

export default StyleSheet.create( {
    agenda: {
        // marginTop: 25,
    },
    agenda2: {
        marginTop: 4,
    },
    item: {
        backgroundColor: "white",
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        height: 95,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    line: {
        borderBottomColor: "#777",
        borderBottomWidth: 0.5,
        top: 15,
    },
    timeBetween: { fontSize: 14, fontWeight: "bold" },
} );
