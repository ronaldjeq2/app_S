import { StyleSheet } from "react-native";

import { colors } from "../../../config/styles";

export default StyleSheet.create( {
    container: { backgroundColor: "#ffff", height: "100%", width: "100%" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#D3D9E0",
    },
    ActualClass: { marginBottom: 20, textAlign: "center" },
} );
