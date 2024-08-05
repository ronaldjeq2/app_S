import React, { Component } from "react";
import { Text, View } from "react-native";
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import stylehour from "./style";

export default class Hourtext extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            tiempo: new Date(),
        };
        this.time = null;
    }

    componentDidMount() {
        this.Changehour();
    }

    componentWillUnmount() {
        clearInterval( this.time );
    }

    Changehour() {
        this.time = setInterval( () => {
            this.setState( {
                tiempo: new Date(),
            } );
        }, 1000 );
    }

    render() {
        const { fonsizeDate, fontsizeHour } = this.props;
        const { tiempo } = this.state;
        return (
            <View style={ [ stylehour.timeconatiner ] }>
                <Text style={ [ stylehour.horastyle, { fontSize: fontsizeHour } ] }>
                    {fnsFormat( tiempo, "HH:mm:ss", {
                        locale: fnsESLocale,
                    } ).toUpperCase()}
                </Text>
                <Text style={ [ stylehour.fechastyle, { fontSize: fonsizeDate } ] }>
                    {fnsFormat( tiempo, "DD-MM-YYYY", {
                        locale: fnsESLocale,
                    } ).toUpperCase()}
                </Text>
            </View>
        );
    }
}
