import { StyleSheet, Dimensions } from "react-native";

import { colors } from "../../config/styles";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
const DEVICE_HEIGHT = Dimensions.get( "window" ).height;
export default StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: "#FFFF",
    },

    infoContain: {
        backgroundColor: "#FFFF",
        height: DEVICE_HEIGHT * 0.12,
        justifyContent: "center",
        alignItems: "center",
    },

    textBank: {
        marginLeft: 10,
    },
    empty: {
        flex: 1,
    },

    emptyText: {
        flex: 1,
        marginTop: "70%",
        textAlign: "center",
    },
    mountCancelate: {
        backgroundColor: "#D3D9E0",
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 12,
    },

    importantText: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: colors.$senatiBlue,
        textAlignVertical: "center",
    },
    textPrecaution: {
        color: colors.$lightBlue,
        textAlign: "center",
        paddingHorizontal: DEVICE_WIDTH * 0.1,
        fontSize: 16,
    },
} );
