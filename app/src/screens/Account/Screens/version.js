import React, { Component } from "react";
import { View, ScrollView, Text } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import { Crashlytics } from "react-native-fabric";
import firebase from 'react-native-firebase';
import { appVersionRequest } from "../../../actions/versionApp";
import settings from "../../../config/settings";
import styles from "../styles";
import InfoApp from "./components/infoApp";
import HR from "../../../components/HR";
import { colors } from "../../../config/styles";
import { Loader } from "../../../components";

class Version extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        hasError: PropTypes.bool,
        hasloaded: PropTypes.bool,
        versionDetail: PropTypes.object,
    };

    constructor( props ) {
        super( props );
        this.getVersionDetail()
    }

    componentDidMount() {
        firebase.crashlytics().log("VersionApp fue montado" )

      //  Crashlytics.log( "VersionApp fue montado" );
    }

    getVersionDetail(){
        const { dispatch } = this.props;
        const versionApp = `${ settings.appVersion.split( "." )[ 0 ] }.${
            settings.appVersion.split( "." )[ 1 ]
        }`;
        dispatch( appVersionRequest( versionApp ) );
    }

    render() {
        const { hasloaded, versionDetail } = this.props;
        if (
            hasloaded === false
            || versionDetail === undefined
            || versionDetail.detail === undefined
        ) {
            return <Loader />;
        }

        return (
            <ScrollView style={ styles.container }>
                <InfoApp item={ versionDetail } />
                <HR />
                <Text
                    style={ [
                        styles.textitle,
                        {
                            color: colors.$lighterBlue,
                            marginLeft: 20,
                        },
                    ] }
                >
                    Novedades
                </Text>
                <View style={ [ { padding: 22, justifyContent: "center" } ] }>
                    <Text style={ [ { fontSize: 15 } ] }>En esta versión te traemos:</Text>

                    {Object.values( versionDetail.detail ).map( ( item, key ) => (
                        <Text key={key} style={ styles.textDetailApp }>
                            {`-${ item }`}
                        </Text>
                    ) )}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ( {
    versionDetail: state.appVersion.versionDetail,
    hasloaded: state.appVersion.hasloaded,
    hasError: state.error.hasError,
} );

export default connect( mapStateToProps )( Version );
