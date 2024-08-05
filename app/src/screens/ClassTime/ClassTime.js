import React, { Component } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { connect } from "react-redux";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import style from "./styles";
import { classtimesRequest } from "../../actions/classtimes";
import { Errortext } from "../../components/Error";

LocaleConfig.locales.es = {
    monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ],
    monthNamesShort: [
        "Ene.",
        "Feb.",
        "Mar.",
        "Abr.",
        "May.",
        "Jun.",
        "Jul.",
        "Ago.",
        "Sept.",
        "Oct.",
        "Nov.",
        "Dec.",
    ],
    // dayNames: [ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ],
    dayNamesShort: [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab" ],
};

LocaleConfig.defaultLocale = "es";

class ClassTime extends Component {
    static propTypes = {
        isLoadedClass: PropTypes.bool,
        classTimesList: PropTypes.object,
        navigation: PropTypes.object,
        hasError: PropTypes.bool,
        connected: PropTypes.bool,
        lastUpdated: PropTypes.string,
    };

    static navigationOptions = ( { navigation } ) => {
        const { params } = navigation.state;

        return {
            title: params ? params.title : "Horario",
            /* These values are used instead of the shared configuration! */
        };
    };

    constructor( props ) {
        super( props );
        this.state = {
            items: {},
        };
    }

    componentDidMount() {
        firebase.crashlytics().log("ClasstimesScreen fue montado")

       // Crashlytics.setString( "componentDidMount", "ClasstimesScreen" );
      //  Crashlytics.log( "ClasstimesScreen fue montado" );
        const currentDate = new Date();
        this.updateTitle( {
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
        } );

        this.fetchData();
    }

    fetchData = ( day ) => {
        const actualdate = day !== undefined
            ? day.dateString
            : fnsFormat( new Date(), "YYYY-MM-DD", {
                locale: fnsESLocale,
            } ).toUpperCase();

        this.props.dispatch( classtimesRequest( actualdate ) );
        const { isLoadedClass, classTimesList } = this.props;
        if (
            ( isLoadedClass === true && day !== undefined )
            || ( Object.keys( classTimesList ).length > 0 && day !== undefined )
        ) {
            for ( let i = -20; i < 85; i++ ) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString( time );
                if ( !this.state.items[ strTime ] ) {
                    this.state.items[ strTime ] = [];
                }
                if ( this.props.classTimesList[ strTime ] ) {
                    this.state.items[ strTime ] = this.props.classTimesList[ strTime ];
                }
            }
            this.setState( {
                items: this.state.items,
            } );
        }
    };

    updateTitle = ( day ) => {
        if ( !day ) {
            return false;
        }
        const title = `${ LocaleConfig.locales.es.monthNames[ day.month - 1 ] } ${ day.year }`;
        if ( this.props.title !== title ) {
            this.props.navigation.setParams( { title } );
        }
        return true;
    };

    rowHasChanged = ( r1, r2 ) => r1.date_event !== r2.date_event
        && r1.begin_time !== r2.begin_time
        && r1.end_time !== r2.end_time;

    timeToString = time => fnsFormat( time, "YYYY-MM-DD", {
        locale: fnsESLocale,
    } ).toUpperCase();

    loadItems = ( day ) => {
        this.fetchData( day );
    };

    renderItem = item => (
        <View style={ [ style.item ] }>
            <Text style={ [ style.timeBetween ] }>
                {item.begin_time}
                {" - "}
                {item.end_time}
            </Text>
            <Text style={ [ { fontSize: 14 } ] }>{item.course_title}</Text>
            <Text style={ [ { fontSize: 13, fontWeight: "200" } ] }>{item.inst_name}</Text>
            <Text style={ [ { fontSize: 12, fontWeight: "200" } ] }>
                {item.bldg_desc}
                {" "}
                {item.bldg_code}
                {" - "}
                {item.room_code}
            </Text>
        </View>
    );

    renderEmptyDate = () => (
        <View style={ style.emptyDate }>
            <View style={ style.line } />
        </View>
    );

    render() {
        const { hasError, connected, lastUpdated } = this.props;
        const showMessage = hasError || !connected;
        return (
            <View style={ { flex: 1 } }>
                {showMessage && <Errortext lastUpdated={ lastUpdated } />}
                <Agenda
                    items={ this.state.items }
                    loadItemsForMonth={ this.loadItems }
                    renderItem={ this.renderItem }
                    renderEmptyDate={ this.renderEmptyDate }
                    rowHasChanged={ this.rowHasChanged }
                    monthFormat="MMMM yyyy"
                    style={ connected && !hasError ? style.agenda : style.agenda2 }
                    onDayChange={ ( day ) => {
                        this.updateTitle( day );
                    } }
                    onDayPress={ ( day ) => {
                        this.updateTitle( day );
                    } }
                />
            </View>
        );
    }
}

const mapStateToProps = ( state ) => {
    const { lastUpdated, classTimesList, isLoadedClass } = state.classtimes;
    const { hasError } = state.error;
    const { connected } = state.network;

    return {
        isLoadedClass,
        lastUpdated,
        classTimesList,
        hasError,
        connected,
    };
};
export default connect( mapStateToProps )( ClassTime );

