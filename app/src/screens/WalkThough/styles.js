import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../config/styles";

const { width, height } = Dimensions.get( "window" );
const photoHeight = width * 0.6 - 20;

export default StyleSheet.create( {
    container: {
        flex: 1,
    },

    slide: {
        justifyContent: 'center',
        width,
        height:height*0.85,
    },

    skipButton: {
        paddingLeft: 20,
        height: 48,
        marginTop: 10,
        alignSelf: "flex-end",
        justifyContent: "center",
    },

    skipText: {
        textAlign: "right",
        marginRight:'5%'
    },

    containerInfo: {
        height:'75%'
    },

    wrapperImage: {
        alignItems: "center",
        marginTop: 5,
        marginBottom: 10,
    },

    image: {
        justifyContent: "center",
        resizeMode: "contain",
        height: photoHeight,
    },

    contentTextWalk: {
        alignContent: "flex-start",
        paddingVertical: 15,
        paddingHorizontal: 30,
    },

    titleWalk: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: colors.$blue,
        fontWeight: "bold",
        fontSize: 20,
    },

    textWalk: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: 15,
    },

    containerTextHandler: {
        marginTop: 10,
        width,
        alignItems:'center',
    },

    textButton: {
        color: colors.$BlueIndicator,
        fontWeight:'bold'
    },
} );
