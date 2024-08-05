import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import style from "./style";

const CourseComponent = ( { data } ) => {
    const {
        titulo, peso, calificacion, debePasar, debePasarDescripcion,
    } = data;
    
    return (
            <View style={ style.container }>
                <View style={ style.componentInfo }>
                    <Text style={ style.title }>{titulo}</Text>
                    <Text style={ style.subtitle }>
                        {debePasarDescripcion}
                                    :
                        {debePasar ? "SI" : "NO"}
                    </Text>
                </View>

                <View style={ [ style.border ] } />

                <View style={ style.item }>
                    <Text style={ style.peso }>{peso}</Text>
                </View>

                <View style={ [ style.border ] } />

                <View style={ style.item }>
                    <Text style={ style.calificacion }>{calificacion || "--"}</Text>
                </View>
            </View>
    );
};

CourseComponent.propTypes = {
    data: PropTypes.object.isRequired,
};

export default CourseComponent;
