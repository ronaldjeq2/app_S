import React, { Component } from "react";

import { View, ScrollView, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import firebase from 'react-native-firebase';
//import { Crashlytics, Answers } from "react-native-fabric";
import { Loader } from "../../../components";

import CourseComponent from "./courseComponent";
import { courseDetailRequest } from "../../../actions/course";
import style from "./style";
import { Errortext } from "../../../components/Error";

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

class CourseDetail extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        isloadedDetail: PropTypes.bool,
        detail: PropTypes.object,
        lastUpdated: PropTypes.string,
    };

    constructor( props ) {
        super( props );

        this.componentCount = 0;
    }

    state = {
        periodo: "2",
        nrc_curso: "2",
    };

    componentDidMount() {
        //.setString( "componentDidMount", "CourseDetail" );
        const { state } = this.props.navigation;
        const { academicHistory, periodo, course } = state.params;

        const currentView = academicHistory
            ? "view_course_historyDetail"
            : "view_course_currentDetail";
        firebase.crashlytics().log("Componente CourseDetail fue montado")
        firebase.analytics().setCurrentScreen(  academicHistory ? "course_historyDetail" : "course_currentDetail","curso")

/*         Crashlytics.log( currentView );
        Answers.logContentView(
            academicHistory ? "course_historyDetail" : "course_currentDetail",
            "curso",
        ); */

        this.fetchCourseDetails( academicHistory, periodo, course );
    }

    fetchCourseDetails( academicHistory, periodo, course ) {
        const nrc_curso = course.nrc;
        const typeCourse = academicHistory ? "historical" : "current";
        this.setState( {
            periodo,
            nrc_curso,
        } );
        this.props.dispatch( courseDetailRequest( periodo, nrc_curso, typeCourse ) );
    }

    getScoreStyles( course ) {
        if ( course.aprobado ) {
            return { color: "#77D353" };
        }
        if ( scoreDefinition[ course.nota ] ) {
            return { color: "#FFBA5C" };
        }
        return {};
    }

    getScoreDefinition( nota ) {
        return scoreDefinition[ nota ] || "Nota Final";
    }

    render() {
        const {
            navigation, isloadedDetail, detail, lastUpdated,
        } = this.props;
        const { periodo, nrc_curso } = this.state;
        const course = navigation.getParam( "course", {} );
        const academicHistory = navigation.getParam( "academicHistory", false );
        if (
            !isloadedDetail
            || detail[ periodo ] === undefined
            || detail[ periodo ][ nrc_curso ] === undefined
        ) {
            return <Loader />;
        }
        const { nrcDetail } = detail[ periodo ][ nrc_curso ];
        const instructorNombre = nrcDetail[ 0 ] ? nrcDetail[ 0 ].instructorNombre : "";
        return (
            <ScrollView style={ { backgroundColor: "#fff" } }>
                <Errortext lastUpdated={ lastUpdated } />
                <View style={ style.courseView }>
                    <Text style={ style.courseTitleDetail }>{course.titulo}</Text>
                    <View style={ style.courseInfoView }>
                        {/* Course Info */}
                        <Text style={ style.courseInfoDetail }>
                            <Text>
                                NRC
                                {" "}
                                {course.nrc}
                                {" "}
                                {"\n"}
                            </Text>
                            <Text style={ { fontWeight: "bold" } }>
                                Instructor
                                {"\n"}
                            </Text>
                            <Text>{instructorNombre || "--"}</Text>
                        </Text>

                        {/* Score */}
                        <View style={ style.courseScoredetail }>
                            <Text
                                style={ [ style.courseScoreNumberDetail, this.getScoreStyles( course ) ] }
                            >
                                {course.nota || "--"}
                            </Text>
                            <Text style={ style.courseDetailScoreLabel }>
                                {this.getScoreDefinition( course.nota )}
                            </Text>
                        </View>
                    </View>

                    {academicHistory && (
                        <Text style={ style.academicHistory }>
                            Nota registrada en el Récord Académico
                        </Text>
                    )}
                </View>

                <View style={ style.componentList }>
                    {!isloadedDetail && <Loader />}

                    {isloadedDetail
                        && nrcDetail.length > 0 && (
                        <View style={ style.componentListHeader }>
                            <Text style={ { flex: 1 } } />
                            <View style={ style.containercomponentHeader }>
                                <Text style={ style.componentHeader }>Peso</Text>
                            </View>
                            <View style={ style.containercomponentHeader }>
                                <Text style={ style.componentHeader }>Nota</Text>
                            </View>
                        </View>
                    )}

                    {isloadedDetail
                        && nrcDetail.length > 0
                        && nrcDetail.map( ( component ) => {
                            this.componentCount += 1;
                            return <CourseComponent key={ this.componentCount } data={ component } />;
                        } )}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = ( state ) => {
    const { isloadedDetail, detail, lastUpdated } = state.course;

    return {
        detail,
        isloadedDetail,
        lastUpdated,
    };
};
export default connect( mapStateToProps )( CourseDetail );
