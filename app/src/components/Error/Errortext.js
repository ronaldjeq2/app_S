import React, { Component } from "react";
import { View, Text } from "react-native";
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./styles";
import { changeConnectionStatus } from "../../actions/network";
import NetInfo from "@react-native-community/netinfo";

class Errortext extends Component {
    static propTypes = {
        error_Message: PropTypes.string,
        dataExist: PropTypes.bool,
        errorColor: PropTypes.string,
        connected: PropTypes.bool,
        hasError: PropTypes.bool,
    };

    constructor( props ) {
        super( props );
    }

    componentDidMount() {
        NetInfo.addEventListener(
            state => {
            this.props.dispatch( changeConnectionStatus( state.type ) );
          }
        );
    }


    render() {
        const {
            connected, hasError, errorColor, error_Message, lastUpdated,
        } = this.props;
        let time;

        time = fnsFormat( lastUpdated, "DD-MMMM-YY HH:mm", {
            locale: fnsESLocale,
        } ).toUpperCase();

        const messageOff = lastUpdated !== "" && lastUpdated !== undefined ? `Ult. sinc. ${ time }` : " ";
        if ( !connected && !hasError ) {
            return (
                <View
                    style={ [
                        styles.errorWrapper,
                        {
                            backgroundColor: "gray",
                        },
                    ] }
                >
                    <Text style={ styles.errorText }>No tienes conexión a internet</Text>

                    <Text style={ styles.errorText }>{messageOff}</Text>
                </View>
            );
        }
        if ( hasError ) {
            const messageError = lastUpdated !== "" && lastUpdated !== undefined ? `Ult. sinc. ${ time }` : "";

            return (
                <View
                    style={ [
                        styles.errorWrapper,
                        {
                            backgroundColor: errorColor,
                        },
                    ] }
                >
                    <Text style={ styles.errorText }>
                        {error_Message}
                        {" "}
                    </Text>
                    <Text style={ styles.errorText }>{messageError}</Text>
                </View>
            );
        }

        return <View />;
    }
}
const mapStateToProps = ( state ) => {
    const hasError = state.error.hasError;
    const error_Message = state.error.error_Message;
    const dataExist = state.error.dataExist;
    const errorColor = state.error.errorColor;
    const connected = state.network.connected;

    return {
        hasError,
        error_Message,
        dataExist,
        errorColor,
        connected,
    };
};
export default connect( mapStateToProps )( Errortext );
