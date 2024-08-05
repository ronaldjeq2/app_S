import React, { Component} from "react";
import { View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { AttendancesPercentage, AttendanceDetail } from "./components";
import HR from "../../../components/HR";
import AssitanceStatus from "./components/assistanceStatus";
import styles from "./styles";
import { Errortext } from "../../../components/Error";
import { Loader } from "../../../components";
import NotInfo from "./components/notInfo";

class Assitance extends Component {
    static propTypes = {
        isLoadedHistory: PropTypes.bool,
        assitanceCourse: PropTypes.object,
        lastUpdated: PropTypes.string,
        navigation: PropTypes.object,
    };

    componentDidMount() {}

    render() {
        const {
            assitanceCourse, isLoadedHistory, lastUpdated, navigation,
        } = this.props;
        const course = navigation.getParam( "course", {} );
        if ( !isLoadedHistory ) {
            return <Loader />;
        }
        if ( course.isVirtual ) {
            return <NotInfo message="Los cursos virtuales no cuentan con asistencia" />;
        }
        if ( Object.keys( assitanceCourse ).length < 1 ) {
            return <NotInfo message="Lo sentimos, no hay información disponible" />;
        }
        const { assistanceList } = assitanceCourse;
        const notAttendanceList = getNoAttendanceList( assistanceList, "I" );
        const notRegisteredAttendanceList = getNoAttendanceList( assistanceList, "N" );

        return (
            <ScrollView style={ styles.container }>
                <Errortext lastUpdated={ lastUpdated } />

                <View style={ { alignItems: "center" } }>
                    <AttendancesPercentage item={ assitanceCourse } />
                </View>
                <Text style={ styles.ActualClass }>
                    {`Última clase registrada:  ${ assitanceCourse.lastAssistance }`}
                </Text>
                <AttendanceDetail item={ assitanceCourse } />
                <HR />
                <AssitanceStatus nrcList={ notAttendanceList } tittle="Detalle inasistencias" />
                <HR />
                <AssitanceStatus
                    nrcList={ notRegisteredAttendanceList }
                    tittle="Asistencias no tomadas"
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ( {
    assitanceCourse: state.course.assitanceCourse,
    isLoadedHistory: state.course.isLoadedAssistance,
    lastUpdated: state.course.lastUpdated,
} );

export default connect( mapStateToProps )( Assitance );

export function getNoAttendanceList( assistanceList, typeAssistance ) {
    const list = {};
    const indices = Object.keys( assistanceList ).filter(
        codDate => assistanceList[ codDate ].type === typeAssistance,
    );

    indices.map( ( item ) => {
        list[ item ] = assistanceList[ item ];
    } );
    return list;
}
