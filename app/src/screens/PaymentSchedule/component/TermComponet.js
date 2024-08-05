import React from "react";
import {
    View, Text, Image, Dimensions, TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import { Loader } from "../../../components";
import { colors } from "../../../config/styles";

const DEVICE_HEIGHT = Dimensions.get("window").height;

const styles = {
    infoMounts: {
        flex: 1,
        height: DEVICE_HEIGHT * 0.12,
        alignItems: "center",
        flexDirection: "row",
        marginTop: 1,
    },
    periodText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 20,
        width: '30%'
    },
    detailPeriod: {
        fontSize: 14,
        marginLeft: 20,
        width: '45%'
    },
    firstView: {
        width: "50%",
        marginLeft: 10,
    },
    secondView: {
        width: "30%",
        marginLeft: 10,
        justifyContent: "center",
    },
    image: {
        marginRight: 10,
        tintColor: "#0E5BE3",
        height: DEVICE_HEIGHT * 0.02,
    },
    finalView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    debt: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
};


const TermComponent = ( {
    item, periodo, onPress
} ) => {
   

    if (item[periodo] === undefined) {
            return <Loader />;
    }
    const infoP = item[periodo];
    const { debt, state } = infoP;
    const colorDebt = debt > 0 ? "#FF9052" : "#13CE66"


    return (
            <TouchableOpacity
                onPress={onPress}
                style={styles.infoMounts}
            >
                {/* Period and PeriodState */}
                <View style={styles.firstView}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}>
                        {periodo}
                    </Text>
                    <Text style={{ fontSize: 14, marginLeft: 10 }}>{state}</Text>
                </View>

                {/* PeriodDebt */}
                <View style={styles.secondView}>
                    <Text
                        style={[
                            styles.debt,
                            {
                                color: debt !== null ? colorDebt : colors.$gray,
                            },
                        ]}
                    >
                        {debt !== null ? `s/.${debt}.00` : `s/. -.--`}
                    </Text>
                </View>

                {/* Period selector for change detailView */}
                <View style={styles.finalView}>
                    <Image
                        resizeMode="contain"
                        source={require("../images/chevron-right.png")}
                        style={styles.image}
                    />
                </View>
            </TouchableOpacity>
    );
};

TermComponent.propTypes = {
    item: PropTypes.object.isRequired,
    periodo: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default TermComponent;
