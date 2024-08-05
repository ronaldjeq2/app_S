import { StyleSheet } from "react-native";
import Dimensions from "Dimensions";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
export default StyleSheet.create( {
    container: {
        paddingTop: 5,
        paddingHorizontal: 15,
        flex: 1,
        backgroundColor: "white",
    },
    item: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    h2: {
        fontSize: 24,
        fontWeight: "600",
        textAlign: "left",
    },
    h3: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "left",
        fontStyle: "italic",
    },
    p: {
        margin: 0,
        padding: 0,
    },
    gallery: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    imageGallery: {
        height: 190,
        width: DEVICE_WIDTH - 30,
        marginVertical: 5,
        borderColor: "#999",
        borderWidth: 1,
    },
    itemList: {
        flexDirection: "row",
        marginBottom: 15,
    },
    itemImage: {
        width: 140,
        height: 140,
        marginRight: 10,
        resizeMode: "cover",
    },
    itemDescription: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    itemDescriptionTitle: {
        fontWeight: "500",
        fontSize: 14,
    },
    itemDescriptionShort: {
        fontWeight: "300",
        fontSize: 12,
        flexDirection: "column",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerNews: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 10,
        flexDirection: "column",
    },
    footerNews: {
        flex: 1,
        paddingBottom: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    footerButton: {
        borderColor: "#8E8E8E",
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    footerText: {
        color: "#8E8E8E",
    },
} );
