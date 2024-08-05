import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import firebase from 'react-native-firebase';
//import { Crashlytics } from "react-native-fabric";

import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";

import { connect } from "react-redux";

import { WeekDayList, ScheduleList } from "./components";
import styles from "./styles";
import { Loader } from "../../../components";
import { Errortext } from "../../../components/Error";

const scheduleListSchema = {
    codTerm: PropTypes.string,
    nrc: PropTypes.string,
    lastUpdated: PropTypes.string,
    startDate: PropTypes.instanceOf( Date ),
    finishDate: PropTypes.instanceOf( Date ),
    schedule: PropTypes.arrayOf(
        PropTypes.shape( {
            key: PropTypes.string.isRequired,
            weekDayList: PropTypes.arrayOf( PropTypes.string ).isRequired,
            classTime: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
            instructor: PropTypes.string.isRequired,
        } ),
    ),
};

class CourseSchedule extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        scheduleIsLoading: PropTypes.bool,
        scheduleListByNRC: PropTypes.shape( scheduleListSchema ),
    };

    componentDidMount() {
        firebase.crashlytics().log("Componente CourseSchedule fue montado ")

      //  Crashlytics.setString( "componentDidMount", "CourseSchedule" );
    }

    getActiveDays = ( courseSchedule ) => {
        let activeDaysList = [];
        courseSchedule.schedule.forEach( ( item ) => {
            activeDaysList = activeDaysList.concat( item.weekDayList );
        } );
        return activeDaysList;
    };

    render() {
        const {
            navigation, scheduleListByNRC, scheduleIsLoading, lastUpdated,
        } = this.props;

        if ( scheduleIsLoading ) {
            return <Loader />;
        }
        const { course } = navigation.state.params;
        const courseSchedule = scheduleListByNRC[ course.nrc ];

        if ( courseSchedule === undefined ) {
            return (
                <View style={ [ styles.container, { padding: 10 } ] }>
                    <Text>Lo sentimos, no hay informacion disponible por el momento</Text>
                </View>
            );
        }
        const startDate = courseSchedule.startDate.split( "T" )[ 0 ];
        const finishDate = courseSchedule.finishDate.split( "T" )[ 0 ];


        return (
            <View style={ styles.container }>
                <Errortext lastUpdated={ lastUpdated } />

                <View style={ styles.header }>
                    <Text style={ styles.headerText }>
                        INICIO:
                        {" "}
                        {fnsFormat( startDate, "DD-MMM-YYYY", {
                            locale: fnsESLocale,
                        } ).toUpperCase()}
                    </Text>
                    <Text style={ styles.headerText }>
                        FIN:
                        {" "}
                        {fnsFormat( finishDate, "DD-MMM-YYYY", {
                            locale: fnsESLocale,
                        } ).toUpperCase()}
                    </Text>
                </View>

                <WeekDayList activeDays={ this.getActiveDays( courseSchedule ) } />

                <ScheduleList scheduleList={ courseSchedule.schedule } />
            </View>
        );
    }
}

const mapStateToProps = ( state ) => {
    const { scheduleListByNRC, scheduleIsLoading, lastUpdated } = state.course;

    return {
        scheduleListByNRC,
        scheduleIsLoading,
        lastUpdated,
    };
};

export default connect( mapStateToProps )( CourseSchedule );
