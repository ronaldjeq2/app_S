import React, { Component } from "react";

import {
    StyleSheet, View, Image, Text, TouchableOpacity,
} from "react-native";

import PropTypes from "prop-types";
import style from "./style";

const scoreDefinition = {
    AJ: "Error administrativo",
    DD: "NRC borrado",
    DE: "Desaprobado",
    "DESAP.": "Desaprobado",
    RE: "Retiro",
    RI: "Ajuste",
    WA: "Retiro autorizado",
    WN: "Abandono de periodo",
    WS: "Reserva de vacante",
};

function getScoreStyles( course )  {
    if ( course.aprobado ) {
        return { color: "#77D353" };
    }
    if ( scoreDefinition[ course.nota ] ) {
        return { color: "#FFBA5C" };
    }
    return {};
};

function getScoreDefinition (nota) {
   return scoreDefinition[ nota ] || "Nota Final";
} 

const CourseView = ( {
    onPress,course
} ) => (
        <TouchableOpacity style={ style.course } onPress={ onPress }>
            {/* Info course */}
            <View style={ style.courseInfo }>
                <Text style={ style.courseTitle }>{course.titulo}</Text>
                <Text style={ style.courseCode }>{`NRC ${ course.nrc }`}</Text>
            </View>

            {/* Score */}
            <View style={ style.courseScore }>
                <Text style={ [ style.courseScoreNumber, getScoreStyles( course ) ] }>
                        {course.nota || "--"}
                </Text>
                <Text style={ style.courseScoreLabel }>
                        {getScoreDefinition( course.nota )}
                </Text>
            </View>

            <Image
                source={ require( "../../Account/images/chevron-right.png" ) }
                style={ style.arrow }
            />
        </TouchableOpacity>
);

CourseView.propTypes = {
    onPress: PropTypes.func.isRequired,
    course: PropTypes.object.isRequired,
};

export default CourseView;
