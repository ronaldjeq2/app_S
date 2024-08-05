import React, { Component } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import firebase from 'react-native-firebase';
//import { Crashlytics } from "react-native-fabric";
import { courseRequest } from "../../actions/course";

import CourseView from "./components/course";
import CourseListHeader from "./components/CourseListHeader";
import Message from "./components/Message";
import style from "./styles";
import { Errortext } from "../../components/Error";

class CurrentCourses extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        isLoadedCurrent: PropTypes.bool,
        navigation: PropTypes.object,
        courseList: PropTypes.object,
        lastUpdated: PropTypes.string,
    };

    componentDidMount() {
        firebase.crashlytics().log("Componente CurrentCourses fue montado")

      //  Crashlytics.setString( "componentDidMount", "CurrentCourses" );
        const { dispatch } = this.props;
        dispatch( courseRequest( "current" ) );
    }

    handleCoursePress = ( curso, item ) => {
        const { periodo, pidm } = item;
        const course = curso;
        const academicHistory = false;
        const { navigation } = this.props;

        navigation.navigate( "CurrentDetail", {
            course,
            periodo,
            pidm,
            academicHistory,
        } );
    };

    render() {
        const { isLoadedCurrent, courseList, lastUpdated } = this.props;
        if ( !isLoadedCurrent ) {
            return <ActivityIndicator size="large" color="#274188" style={ [ style.indicator ] } />;
        }
        const { current } = courseList;

        if ( current.length === 0 ) {
            return (
                <Message
                    title="NO TIENES CURSOS EN PROGRESO"
                    content="Actualmente no estás registrado en algún periodo vigente."
                />
            );
        }

        return (
            <ScrollView style={ [ style.container, { backgroundColor: "#E9E9EF" } ] }>
                {/* Program && Career */}
                <Errortext lastUpdated={ lastUpdated } />

                {current.map( item => (
                    <View key={ item.periodo }>
                        {/* Title */}
                        <CourseListHeader item={ item } />

                        {/* List of Courses */}
                        <View>
                            {item.cursos.map( course => (
                                <CourseView
                                    key={ course.nrc }
                                    course={ course }
                                    onPress={ () => this.handleCoursePress( course, item ) }
                                />
                            ) )}
                        </View>
                    </View>
                ) )}
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ( {
    isLoadedCurrent: state.course.isLoadedCurrent,
    courseList: state.course.courseList,
    lastUpdated: state.course.lastUpdated,
} );

export default connect( mapStateToProps )( CurrentCourses );
