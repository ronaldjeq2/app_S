import React, { Component } from "react";
import PropTypes from "prop-types";

import {
    View,
    Image,
    ActivityIndicator,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import firebase from 'react-native-firebase';
//import { Crashlytics } from "react-native-fabric";
import style from "./styles";
import { courseRequest } from "../../actions/course";
import CourseListHeader from "./components/CourseListHeader";
import { Errortext } from "../../components/Error";

class HistoryCourses extends Component {
    static propTypes = {
        isLoadedHistory: PropTypes.bool,
        navigation: PropTypes.object,
        courseList: PropTypes.object,
        lastUpdated: PropTypes.string,
    };

    constructor( props ) {
        super( props );
        const typeList = "historical";
        this.props.dispatch( courseRequest( typeList ) );
    }

    state = {
        data: this.props.courseList.historical,
        dataOri: this.props.courseList.historical,
    };

    componentDidMount() {
        firebase.crashlytics().log("Componente HistoryCourses fue montado")

        //Crashlytics.setString( "componentDidMount", "HistoryCourses" );
    }

    componentDidUpdate( prevProps ) {
        if ( prevProps.isLoadedHistory !== this.props.isLoadedHistory ) {
            const { historical } = this.props.courseList;

            this.setState( {
                dataOri: historical,
                data: historical,
            } );
        }
    }

    filterData = ( input ) => {
        const { data, dataOri } = this.state;
        const keyWord = input.toLowerCase();

        let filteredData;

        // Check if data changed
        // to prevent ussesles re-render
        let changed = false;

        if ( !input ) {
            changed = data.length !== dataOri.length;
            filteredData = dataOri;
        }
        else {
            filteredData = dataOri.filter( ( item ) => {
                const keyString = item.idCarrera;

                if ( keyString.indexOf( keyWord ) !== -1 ) {
                    return true;
                }
            } );

            let currentKeys = data.map( item => item.idCarrera );
            let filteredKeys = filteredData.map( item => item.idCarrera );

            currentKeys = currentKeys.sort().join( "-" );
            filteredKeys = filteredKeys.sort().join( "-" );

            changed = currentKeys !== filteredKeys;
        }

        if ( changed ) {
            this.setState( { data: filteredData } );
        }
    };

    getHistoryDetail = ( item ) => {
        const { lastUpdated } = this.props;
        firebase.crashlytics().log("action: Navigate - HistoryDetail")
       // Crashlytics.log( "action: Navigate - HistoryDetail" );
        this.props.navigation.navigate( "HistoryDetail", {
            item,
            lastUpdated,
        } );
    };

    render() {
        const { data, dataOri } = this.state;
        const { lastUpdated } = this.props;

        if ( !this.props.isLoadedHistory ) {
            return <ActivityIndicator size="large" color="#274188" style={ [ style.indicator ] } />;
        }

        return (
            <ScrollView style={ [ style.container, { backgroundColor: "#E9E9EF" } ] }>
                <Errortext lastUpdated={ lastUpdated } />
                <View style={ style.searchInputView }>
                    <Image source={ require( "./images/search.png" ) } style={ style.inlineImg } />
                    <TextInput
                        style={ style.textInput }
                        placeholder="Ingresa periodo, carrera o programa"
                        placeholderTextColor="#8492A6"
                        underlineColorAndroid="transparent"
                        onChangeText={ this.filterData }
                    />
                </View>
                {/* Program && Career */}
                {data
                    && data.length > 0
                    && data.map( item => (
                        <TouchableOpacity
                            key={ item.idCarrera }
                            onPress={ () => {
                                this.getHistoryDetail( item );
                            } }
                        >
                            <View style={ style.item }>
                                <View style={ style.info }>
                                    <CourseListHeader item={ item } />
                                </View>
                                <Image
                                    source={ require( "./images/chevron-right.png" ) }
                                    style={ style.arrow }
                                />
                            </View>
                        </TouchableOpacity>
                    ) )}
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ( {
    isLoadedHistory: state.course.isLoadedHistory,
    courseList: state.course.courseList,
    lastUpdated: state.course.lastUpdated,
} );
export default connect( mapStateToProps )( HistoryCourses );
