import React, { Component } from "react";
import {
    Text, View, ScrollView,
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import style from "./styles";
import { paymentChangePeriod } from "../../actions/payments";
import TermComponent from "./component/TermComponet";
import FilterButton from "./component/TermList/FilterButton";
import { HR } from "../../components";
import { Errortext } from "../../components/Error";

class TermList extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        navigation: PropTypes.object,
        termList: PropTypes.object,
        hasError: PropTypes.bool,
        connected: PropTypes.bool,
        lastTerm: PropTypes.string,
        lastUpdated: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            filterKey: null,
        };
    }

    selectedTerm = (termSelected) => {
        const { dispatch } = this.props;
        dispatch(paymentChangePeriod(termSelected));
        const { navigation } = this.props;
        navigation.navigate("PaymentSchedule");
    };

    handleFilterButton = (newFilterKey) => {
        const { filterKey } = this.state;
        if (newFilterKey === filterKey) {
            this.setState({ filterKey: "all" });
        }
        else {
            this.setState({ filterKey: newFilterKey });
        }
    };

    getFilteredKeyList = () => {
        const { filterKey } = this.state;
        const { termList } = this.props;

        let keyList = [];

        if (filterKey === "hasDebt") {
            keyList = Object.keys(termList).filter(codTerm => termList[codTerm].debt > 0 && termList[codTerm].debt !== null);
        }
        else if (filterKey === "noDebt") {
            keyList = Object.keys(termList).filter(codTerm => termList[codTerm].debt <= 0 && termList[codTerm].debt !== null);
        }
        else {
            keyList = Object.keys(termList);
        }

        return keyList.sort((a, b) => a < b);
    };

    render() {
        const { termList, lastUpdated } = this.props;
        const { filterKey } = this.state;

        const filteredKeyList = this.getFilteredKeyList();

        return (
            <View
                style={{
                    backgroundColor: "#FFFF",
                    height: "100%",
                }}
            >
                <Errortext lastUpdated={lastUpdated} />
                <View
                    style={{
                        height: 90,
                    }}
                >
                    <Text style={{ color: "#3D9DF4", padding: 15, fontWeight: "bold" }}>
                        Estado
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <FilterButton
                            onPress={() => this.handleFilterButton("hasDebt")}
                            activeButton={filterKey === "hasDebt"}
                            colorText="#FFBF34"
                            textButton="Pendiente"
                        />
                        <FilterButton
                            onPress={() => this.handleFilterButton("noDebt")}
                            activeButton={filterKey === "noDebt"}
                            colorText="#13CE66"
                            textButton="Sin deuda"
                        />
                    </View>
                </View>
                <HR />
                {/* Listado de info de todas las cuotas del periodo */}
                <ScrollView Style={{ flex: 1 }}>
                    {filteredKeyList.map(codTerm => (
                        <View key={termList[codTerm].codPayment}>
                            <TermComponent
                                item={termList}
                                periodo={codTerm}
                                onPress={() => this.selectedTerm(codTerm)}
                            />

                            <HR />
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        termList, termSelected, lastTerm, lastUpdated,
    } = state.payments;
    const { hasError } = state.error;
    const { connected } = state.network;

    return {
        termList,
        hasError,
        connected,
        termSelected,
        lastTerm,
        lastUpdated,
    };
};

export default connect(mapStateToProps)(TermList);
