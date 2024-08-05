import { StyleSheet } from "react-native";

import { colors } from "../../../config/styles";

export default StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: colors.$white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#D3D9E0",
    },
    headerText: {
        fontSize: 15,
    },
} );
