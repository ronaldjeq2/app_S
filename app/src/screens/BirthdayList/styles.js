import { StyleSheet, Platform } from "react-native";
import { colors } from "../../config/styles";

export default StyleSheet.create( {
    indicator: {
        flex: 1,
    },

    empty: {
        flex: 1,
    },

    emptyText: {
        flex: 1,
        marginTop: "70%",
        textAlign: "center",
    },

    container: {
        backgroundColor: colors.$white,
        flex: 1,
    },

    birthdayGreeting: {
        alignItems: "center",
        paddingTop: 25,
        paddingBottom: 10,
    },

    messagebirthday: {
        padding: 10,
        color: colors.$lightBlue,
        fontSize: 20,
        fontWeight: "bold",
    },

    greetingContainer: {
        flex: 1,
        paddingBottom: 10,
    },

    personImage: {
        tintColor: colors.$gray,
    },

    personImageActive: {
        tintColor: colors.$lightBlue,
    },

    birthdayGreetingListItem: {
        flexDirection: "row",
        padding: 8,
    },

    student: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: "center",
    },

    birthDateContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 80,
    },

    birthDateDay: {
        fontSize: 25,
        fontWeight: "bold",
    },

    birthDateDayName: {
        color: colors.$lightGray,
    },

    upcomingContainer: {
        flex: 1,
        backgroundColor: colors.$white,
    },

    upcomingMonth: {
        paddingBottom: 10,
    },

    upcomingHeader: {
        backgroundColor: colors.$lightBlue,
        paddingVertical: 15,
        paddingLeft: 20,
        borderTopColor: colors.$blue,
        borderTopWidth: 5,
    },
    
    monthText: {
        fontSize: 25,
        color: colors.$white,
        fontWeight: "bold",
    },
} );
