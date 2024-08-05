import React from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";

import { colors } from "../../../config/styles";

const styles = {
    container: {
        padding: 10,
    },
    title: {
        color: colors.$senatiBlue,
        fontSize: 14,
        fontWeight: "bold",
    },

    subTitle: {
        color: "#5A6978",
        fontSize: 11,
        fontWeight: "100",
    },
};

const courseListHeader = ( { item } ) => (
    <View style={ styles.container }>
        <Text style={ styles.title }>{`${ item.periodo } | ${ item.carrera }`}</Text>
        <Text style={ styles.subTitle }>{`${ item.programa }`}</Text>
    </View>
);

courseListHeader.propTypes = {
    item: PropTypes.object.isRequired,
};

export default courseListHeader;
