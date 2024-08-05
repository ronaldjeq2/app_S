import React, { Component } from "react";
import { View, ScrollView, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import style from "./styles";
import { paymentsDetailRequest, paymetsRequest } from "../../actions/payments";
import { Loader, HR } from "../../components";
import { HeaderPeriod, CurrentPayment } from "./component/PaymentSchedule/DetailPeriod";
import CodPayment from "./component/PaymentSchedule/CodPayment";
import DetailBank from "./component/PaymentSchedule/DetailBank";
import PeriodPayments from "./component/PaymentSchedule/PeriodPayments";
import { Errortext } from "../../components/Error";
import HeaderWithRightButton from "../../components/Header/HeaderWithRightButton";
import NotAvailableInfo from "./component/notAvailableInfo";

class PaymentSchedule extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        navigation: PropTypes.object,
        isTermDetailLoaded: PropTypes.bool,
        termList: PropTypes.object,
        lastTerm: PropTypes.string,
        termSelected: PropTypes.string,
        lastUpdated: PropTypes.string,
        detailBank: PropTypes.string,
        bankSelected: PropTypes.string,
    };

    constructor(props) {
        super(props);
        const { dispatch } = this.props;
        dispatch(paymetsRequest());
    }

    componentDidMount() {
        this.getTermDetail();
    }

    getTermDetail() {
        const { dispatch } = this.props;
        dispatch(paymentsDetailRequest());
    }

    selectBank = () => {
        const { navigation } = this.props;
        navigation.navigate("BankSelect");
    };

    handlePeriodList = () => {
        const { navigation } = this.props;
        navigation.navigate("OtherPeriods");
    };

    handleGoBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    render() {
        const {
            termSelected, isTermDetailLoaded, termList, lastTerm, lastUpdated, bankSelected, detailBank
        } = this.props;

        const period = termSelected === null ? lastTerm : termSelected;
        const { mountCanceled, listPayments } = termList[period] || {
            mountCanceled: null,
            listPayments: [],
        };
        return (
            <View style={style.container}>
                <HeaderWithRightButton
                    onLeftButtonPress={() => this.handleGoBack()}
                    onRightButtonPress={() => this.handlePeriodList(termList)}
                    imageIcon={require("./images/searchSchedule.png")}
                    headerTittle="Cronograma"
                />
                <Errortext lastUpdated={lastUpdated} />

                {!isTermDetailLoaded && <Loader />}
                {termList[period] === undefined && (
                    <View style={[style.empty, { flex: 1, backgroundColor: "white" }]}>
                        <Text style={style.emptyText}>No tienes información disponible</Text>
                    </View>
                )}
                {isTermDetailLoaded
                    && termList[period] !== undefined
                    && termList[period].debt === null && (
                        <NotAvailableInfo
                            codPayment={termList[period].codPayment}
                            period={period}
                        />
                    )}

                {isTermDetailLoaded
                    && termList[period] !== undefined
                    && termList[period].debt !== null && (
                        <ScrollView style={{ flex: 1 }}>
                            {/* Periodo, estado de cuotas y total del periodo */}
                            <HeaderPeriod item={termList[period]} period={period} />
                            {/* Datos de la couta del mes actual */}
                            <CurrentPayment item={termList[period]} />
                            <HR />

                            {/* Código de pago para las cuotas periodo */}
                            <CodPayment codPayment={termList[period].codPayment} />
                            <HR />

                            {/* Especificaciones del Banco de preferencia */}
                            <DetailBank onPress={() => this.selectBank()}
                                bankSelected={bankSelected}
                                detailBank={detailBank}
                            />

                            {/* Monto de cuotas canceladas del periodo y el listado de info de todas las cuotas del periodo */}

                            <PeriodPayments
                                mountCanceled={mountCanceled}
                                listPayments={listPayments}
                            />
                        </ScrollView>
                    )}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        isTermDetailLoaded, termList, termSelected, lastTerm, lastUpdated, bankSelected, detailBank
    } = state.payments;

    return {
        termList,
        isTermDetailLoaded,
        termSelected,
        lastTerm,
        lastUpdated,
        detailBank,
        bankSelected
    };
};

export default connect(mapStateToProps)(PaymentSchedule);
