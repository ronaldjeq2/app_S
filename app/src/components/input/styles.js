import { StyleSheet } from "react-native";

import { colors } from "../../config/styles";

const styles = StyleSheet.create( {
    container: {
        paddingVertical: 10,
        minHeight: 48,
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.$gray,
        borderRadius: 15,
        fontSize: 18,
        minHeight: 48,
    },
    inputIcon: {
        paddingLeft: 40,
    },
    iconWrapper: {
        position: "absolute",
        top: "50%",
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
