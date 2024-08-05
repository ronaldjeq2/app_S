import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View, ScrollView, Text
} from "react-native";
import { connect } from "react-redux";

import styles from "../../styles";
import { colors } from "../../../../config/styles";

const vigente = {
    firstPeriod: "Primer periodo:",
    currentPeriod: "Periodo reciente:",
    studenType: "Tipo Alumno:",
    lessons: "Clase:",
    blocks: "Bloque:",
};
const curriculum = {
    level: "Nivel:",
    program: "Programa:",
    school: "Escuela:",
    campus: "Campus",
};

export function getText( text ) {
    if ( Array.isArray( text ) ) {
        const breakLine = text.length > 1 ? "\n" : "";
        return text.map( item => (
            <Text style={ styles.TitleItem } key={ text }>
                {`${ item } ${ breakLine }`}
            </Text>
        ) );
    }
    return text;
}
export default class InfoCareer extends Component {
    static propTypes = {
        title: PropTypes.string,
        item: PropTypes.object,
        tipo: PropTypes.string,
    };


    render() {
        const { title, tipo, item } = this.props;
        let list = curriculum;
        if ( tipo === "vigente" ) {
            list = vigente;
        }
        return (
            <ScrollView style={ styles.containerDates }>
                <Text style={ [ styles.textitle, { color: colors.$lighterBlue } ] }>{title}</Text>
                {Object.keys( item ).length === 0 && (
                    <Text style={ { marginTop: 10 } }>No hay información disponible</Text>
                )}
                {Object.keys( item ).map( key => (
                    <View style={ [ styles.contentItems ] } key={ key }>
                        <Text style={ styles.TitleItem }>{list[ key ]}</Text>
                        <Text style={ [ styles.TextDate, { color: colors.$BlueIndicator } ] }>
                            {getText( item[ key ] )}
                        </Text>
                    </View>
                ) )}
            </ScrollView>
        );
    }
}
