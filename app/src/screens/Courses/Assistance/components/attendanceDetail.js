import React from "react";
import { View, Text } from "react-native";
import DetailSpecific from "./detailspecific";

const style = {};

const AttendanceDetail = ( { item } ) => {
    const {
        totalClass, classAssistance, assistance, noAttendance, notRegistered,
    } = item;
    return (
        <View style={ { alignItems: "center", marginBottom: 5 } }>
            <DetailSpecific Type="Total de Clases" number={ totalClass } numberColor="#525B6B" />
            <DetailSpecific
                Type="Asistencias tomadas"
                number={ classAssistance }
                numberColor="#525B6B"
            />
            <DetailSpecific Type="Asistidas" number={ assistance } numberColor="#13CE66" />
            <DetailSpecific Type="Inasistencias" number={ noAttendance } numberColor="#F95F62" />
            <DetailSpecific
                Type="Asistencias no tomadas"
                number={ notRegistered }
                numberColor="#525B6B"
            />
        </View>
    );
};

export default AttendanceDetail;
