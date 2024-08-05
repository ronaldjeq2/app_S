import { StyleSheet } from "react-native";

import { colors } from "../../config/styles";

const styles = StyleSheet.create( {
    container: {
        paddingVertical: 10,
        marginTop: 10,
        marginBottom: 10,
        height: 40,
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.$gray,
        borderRadius: 15,
        fontSize: 20,
        height: 48,
    },
    inputIcon: {
        paddingLeft: 40,
    },
    iconWrapper: {
        position: "absolute",
        top: 24,
    },
    iconWrapperLeft: {
        left: 10,
    },
    iconWrapperRight: {
        height: 48,
        width: 48,
        justifyContent: "center",
        alignItems: "center",
        top: 10,
        right: 10,
    },
    icon: {
        height: 20,
    },
} );

export default styles;
