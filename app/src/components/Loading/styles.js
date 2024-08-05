import { StyleSheet } from "react-native";

import { colors } from "../../config/styles";

const styles = StyleSheet.create( {
    container: {
        height: "100%",
        backgroundColor: colors.$white,
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 65,
    },
    image: {
        alignSelf: "center",
    },
    message: {
        paddingTop: 10,
        textAlign: "center",
        fontSize: 18,
        color: colors.$gray,
    },
} );

export default styles;
