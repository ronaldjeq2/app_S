import React, { Component } from "react";
import {
    Text, View, Dimensions,ScrollView,
} from "react-native";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import style from "./styles";
import { changeBankSlected } from "../../actions/payments";
import InfoPay from "./component/BankSelect/InfoPay";
import BankList from "./component/BankSelect/BankList";
import { HR } from "../../components";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
const listhbirthday = [
    {
        key: 1,
        bankSelected: "BANCO DE CREDITO DEL PERU (BCP)",
        detailBank: "Cuenta de recaudación SENATI Ingresos-Alumnos",
        preferido: false,
    },
    {
        key: 2,
        bankSelected: "BANCO CONTINENTAL",
        detailBank: "Cuenta del servicio de recaudación 621 - Alumnos",
        preferido: false,
    },
    {
        key: 3,
        bankSelected: "BANCO INTERBANK",
        detailBank: "Cuenta de recaudación 0600502 - Alumnos",
        preferido: false,
    },
    {
        key: 4,
        bankSelected: "BANCO SCOTIABANK",
        detailBank: "Recaudación SENATI - Ingresos - Alumnos",
        preferido: true,
    },

    {
        key: 5,
        bankSelected: "BANCO BANBIF",
        detailBank: "Cuenta Recaudadora Alumnos",
        preferido: false,
    },
];
class BankSelect extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        bankSelected: PropTypes.string,
        dispatch: PropTypes.func,
    };

    constructor( props ) {
        super( props );
        this.state = {};
    }

    selectedBank = ( item ) => {
        const { navigation, dispatch } = this.props;
        const { bankSelected, detailBank } = item;
        dispatch( changeBankSlected( bankSelected, detailBank ) );
        navigation.goBack();
    };

    render() {
        const { bankSelected } = this.props;

        return (
            <ScrollView style={ style.container }>
                <View
                    style={ {
                        justifyContent: "center",
                        backgroundColor: "#D3D9E0",
                        paddingVertical: 10,
                    } }
                >
                    <Text style={ style.importantText }>IMPORTANTE</Text>
                </View>

                {/* Informacion para realizar el pago */}
                <InfoPay />
                <HR />

                {/* Términos y condiciones */}
                <View style={ style.infoContain }>
                    <Text style={ style.textPrecaution }>
                        {
                            "SENATI no se responsabiliza por pagos realizados en efectivo o en cuentas no indicadas en la relación."
                        }
                    </Text>
                </View>

                {/* Monto de cuotas canceladas del periodo */}
                <View style={ style.mountCancelate }>
                    <Text style={ [ style.textBank, { textAlignVertical: "center" } ] }>
                        {
                            "Escoge un banco de la lista inferior para mostrarlo en la pantalla principal"
                        }
                    </Text>
                </View>

                {/* Listado de info de todas las cuotas del periodo */}
                <View>
                    {listhbirthday.map( item => (
                        <View key={ item.key }>
                            <BankList
                                onPress={ () => this.selectedBank( item ) }
                                detailBank={ item.detailBank }
                                bankSelect={ item.bankSelected }
                                bank={ bankSelected }
                            />
                            <HR />
                        </View>
                    ) )}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = ( state ) => {
    const { detailBank, bankSelected } = state.payments;

    return {
        detailBank,
        bankSelected,
    };
};

export default connect( mapStateToProps )( BankSelect );
