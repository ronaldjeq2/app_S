import { StyleSheet } from "react-native";

import { colors } from "../../config/styles";

export default StyleSheet.create( {
    container: {
        backgroundColor: colors.$white,
        flex: 1,
        flexWrap: "wrap",
        flexDirection: "row",
        paddingTop: 20,
    },
} );
