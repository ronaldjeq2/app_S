import React, { Component } from "react";

import { View, ScrollView, Text } from "react-native";
import PropTypes from "prop-types";
import firebase from 'react-native-firebase';

//import { Crashlytics } from "react-native-fabric";
import CourseView from "./components/course";
import CourseListHeader from "./components/CourseListHeader";
import style from "./styles";
import { Errortext } from "../../components/Error";

export default class HistoryDetail extends Component {
    static propTypes = {
        navigation: PropTypes.object,
    };

    componentDidMount() {
        firebase.crashlytics().log("Componente HistoryDetail fue montado ")

      //  Crashlytics.setString( "componentDidMount", "HistoryDetail" );
    }

    handleCoursePress = ( curso, item ) => {
        const { periodo, pidm } = item;
        const course = curso;
        const academicHistory = true;
        this.props.navigation.navigate( "CourseDetail", {
            course,
            periodo,
            pidm,
            academicHistory,
        } );
    };

    render() {
        const { navigation } = this.props;
        const item = navigation.getParam( "item", {} );
        const lastUpdated = navigation.getParam( "lastUpdated", "" );

        return (
            <ScrollView>
                <Errortext lastUpdated={ lastUpdated } />
                <View style={ style.info }>
                    <CourseListHeader item={ item } />
                </View>
                {Object.keys( item.cursos ).length > 0
                    && Object.values( item.cursos ).map( curso => (
                        <CourseView
                            key={ curso.nrc }
                            course={ curso }
                            onPress={ () => this.handleCoursePress( curso, item ) }
                        />
                    ) )}
            </ScrollView>
        );
    }
}
