import { StyleSheet, Platform, Dimensions } from "react-native";

import { colors } from "../../../config/styles";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
const DEVICE_HEIGHT = Dimensions.get( "window" ).height;
export default StyleSheet.create( {
    container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginBottom: 5,
    },
    arrow: {
        width: 11,
        height: 18,
        marginRight: 10,
    },
    border: { borderLeftWidth: 1, borderColor: "#d6d7da" },
    componentInfo: {
        flex: 1,
        paddingVertical: 15,
        paddingLeft: 20,
    },
    title: {
        color: "#00A6FF",
        fontWeight: "bold",
    },
    subtitle: {
        color: "#8492A6",
        fontSize: 12,
    },
    item: {
        alignSelf: "center",
        width: 80,
    },
    peso: {
        fontSize: 15,
        textAlign: "center",
        // paddingHorizontal: 10,
    },
    calificacion: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        // paddingHorizontal: 20,
    },
    course: {
        backgroundColor: "#fff",
        marginBottom: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    courseInfo: {
        flex: 3,
        borderRightColor: "#E9E9EF",
        borderRightWidth: 1,
        paddingLeft: 15,
        paddingTop: 15,
        paddingBottom: 15,
    },
    courseTitle: {
        color: "#274187",
        fontSize: 14,
        fontWeight: "bold",
    },
    courseCode: {
        color: "#969FAA",
        fontSize: 9,
        fontWeight: "100",
    },
    courseScore: {
        flex: 1,
    },
    courseScoreNumber: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#969FAA",
    },
    courseScoreLabel: {
        textAlign: "center",
        color: "#8492A6",
        fontSize: 9,
    },
    containerDetail: {
        flex: 1,
    },
    courseView: {
        marginTop: 10,
        backgroundColor: "#fff",
        padding: 20,
    },
    courseTitleDetail: {
        marginBottom: 7,
        color: "#274187",
        fontSize: 16,
        fontWeight: "bold",
    },
    courseInfoView: {
        flexDirection: "row",
        alignItems: "center",
    },
    courseInfoDetail: {
        marginBottom: 5,
        fontSize: 13,
        color: "#47525E",
        flex: 1,
    },
    courseScoredetail: {
        width: 80,
    },
    courseScoreNumberDetail: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#969FAA",
    },
    courseDetailScoreLabel: {
        textAlign: "center",
        color: "#8492A6",
        fontSize: 9,
    },
    academicHistory: {
        color: "rgba(0,166,255,0.5)",
        fontSize: 12,
    },
    componentList: {
        flex: 1,
        marginTop: 10,
    },
    componentListHeader: {
        flexDirection: "row",
    },
    componentHeader: {
        width: 80,
        textAlign: "center",
        color: colors.$senatiWhite,
    },
    indicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    containercomponentHeader: {
        backgroundColor: "#1863D3",
        width: 60,
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 10,
    },
    courseInit: {
        marginVertical: 10,
        width: "50%",
        marginLeft: 15,
    },
    courseFinish: {
        marginVertical: 10,
        flex: 1,
        textAlign: "right",
        marginRight: 15,
    },
    containerCday: {
        backgroundColor: "#FFFF",
        height: 60,
        justifyContent: "center",
        width: DEVICE_WIDTH / 7,
    },
    circleContainerDay: {
        backgroundColor: "#E5E9F2",
        height: 30,
        width: 30,
        alignItems: "center",
        borderRadius: 20,
        marginHorizontal: 15,
        justifyContent: "center",
    },
    containerScheduleCourse: {
        flexDirection: "row",
        marginVertical: 1,
        backgroundColor: "#FFFF",
        width: "100%",
    },
    circleScheduleCourse: {
        backgroundColor: "#1863D3",
        height: 35,
        width: 35,
        alignItems: "center",
        borderRadius: 20,
        marginHorizontal: 10,
        justifyContent: "center",
    },
} );
