import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
    View, Text, TouchableOpacity, Dimensions, Image, Clipboard,
} from "react-native";
import { colors } from "../../../../config/styles";

const DEVICE_HEIGHT = Dimensions.get( "window" ).height;
const styles = {
    payCodeContainer: {
        flexDirection: "row",
        marginTop: 3,
        justifyContent: "center",
        alignItems: "center",
    },

    infoContain: {
        backgroundColor: "#FFFF",
        height: DEVICE_HEIGHT * 0.16,
        justifyContent: "center",
        alignItems: "center",
    },

    payCode: {
        fontSize: 22,
        color: colors.$lightBlue,
        marginLeft: 40,
    },

    copyButton: {
        height: 15,
        tintColor: colors.$lightBlue,
    },
    messageCopy: {
        color: "#FF9052",
        fontSize: 10,
    },
};

class PaymentCode extends PureComponent {
    static propTypes = {
        codPayment: PropTypes.string.isRequired,
    };

    constructor( props ) {
        super( props );
        this.state = {
            copyMessage: false,
        };
        this.copyHandler = null;
        clearTimeout( this.copyHandler );

    }


    copyCodPayment = ( codPayment ) => {
        Clipboard.setString( codPayment );

        if ( this.copyHandler ) {
            clearTimeout( this.copyHandler );
        }

        this.setState(
            {
                copyMessage: true,
            },
            () => {
                this.copyHandler = setTimeout( () => {
                    this.setState( {
                        copyMessage: false,
                    } );
                }, 15000 );
            },
        );
    };

    render() {
        const { codPayment } = this.props;
        return (
            <View style={ [ styles.infoContain, { marginTop: 2 } ] }>
                <Text>Código de pago</Text>
                <TouchableOpacity
                    style={ styles.payCodeContainer }
                    onPress={ () => this.copyCodPayment( codPayment ) }
                >
                    <Text style={ styles.payCode }>{codPayment}</Text>
                    <Image
                        resizeMode="contain"
                        source={ require( "../../images/copy.png" ) }
                        style={ styles.copyButton }
                    />
                </TouchableOpacity>
                <View style={ { height: 10 } }>
                    {this.state.copyMessage && (
                        <Text style={ styles.messageCopy }>Código de pago copiado</Text>
                    )}
                </View>
            </View>
        );
    }
}
export default PaymentCode;
