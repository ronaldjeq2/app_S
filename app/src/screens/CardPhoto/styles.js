import { StyleSheet, Image } from "react-native";
import { colors } from "../../config/styles";

export default StyleSheet.create( {
    container: {
        marginTop: "1%",
        width: "100%",
        height: "98%",
        flexDirection: "row",
        backgroundColor: colors.$blue,
    },
    containersecond: {
        marginTop: "1%",
        width: "100%",
        height: "90%",
        flexDirection: "row",
        backgroundColor: colors.$blue,
    },
    studentconatiner: {
        width: "70%",
        height: "100%",
        margin: 0,
    },
    carnetestudiantil: {
        //resizeMode: Image.resizeMode.contain,
        resizeMode: "contain",

    },
    imagestudentconatiner: {
        marginLeft: 25,
        marginVertical: 10,
        justifyContent: "space-between",
    },
    loadingView: {
        height: "100%",
        width: "35%",
        marginLeft: "0%",
    },
    loading: {
        marginTop: 30,
    },
    studentCardPhoto: {
        // resizeMode: Image.resizeMode.cover,
        // marginLeft: 10,
    },
    studentCardData: {
        flex: 1,
        marginTop: 50,
        marginLeft: 10,
    },
    datos_estudiante: {
        fontFamily: "Gridnik-Bold",
        fontSize: 25,
        color: "white",
    },
    datos_carrera: {
        fontSize: 15,
        color: "white",
        fontFamily: "Gridnik-Bold",
    },
    logo: {
        //resizeMode: Image.resizeMode.contain,
        resizeMode: "contain",
        height: 30,
        width: 30 * ( 117 / 32 ),
    },
    timeconatiner: {
        flex: 1,
        alignItems: "center",
    },
    horastyle: {
        marginTop: "50%",
        fontSize: 35,
        color: "white",
        fontFamily: "Gridnik-Bold",
    },
    fechastyle: {
        marginTop: "5%",
        fontSize: 20,
        color: "white",
        fontFamily: "Gridnik-Bold",
    },
    sloganWrapper: {
        marginBottom: 10,
    },
    slogan: {
        // resizeMode: Image.resizeMode.contain,
        resizeMode: "contain",
    },
} );
