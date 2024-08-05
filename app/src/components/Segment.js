import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { colors, THEME } from "../config/styles";

import HR from "./HR";

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: colors.$white,
        paddingHorizontal: 0,
    },
    segmentWrapper: {
        flexDirection: "column",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    segmentTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.$lighterBlue,
        paddingVertical: 10,
    },
    segmentContent: {
        paddingVertical: 10,
    },
    segmentItemWrapper: {
        marginVertical: 5,
        flexDirection: "column",
    },
    segmentItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
    },
    segmentItemText: {
        fontSize: 16,
        flex: 1,
    },
    segmentItemLabelWrapper: {
        backgroundColor: colors.$lightBlue,
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 7,
    },
    segmentItemLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.$white,
    },
    segmentItemSubtitle: {
        color: colors.$gray,
        fontSize: 16,
    },
} );

export const SegmentItem = ( { text = "item text", label, subtitle } ) => (
    <View style={ styles.segmentItemWrapper }>
        <View style={ styles.segmentItem }>
            <Text style={ styles.segmentItemText }>{text}</Text>
            {label && (
                <View style={ styles.segmentItemLabelWrapper }>
                    <Text style={ styles.segmentItemLabel }>
                        {label}
                        {" "}
                    </Text>
                </View>
            )}
        </View>
        {subtitle && <Text style={ styles.segmentItemSubtitle }>{subtitle}</Text>}
    </View>
);

export class Segment extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        emptyMessage: PropTypes.string,
        items: PropTypes.array,
        children: PropTypes.element,
    };

    static defaultProps = {
        items: [],
        emptyMessage: "No hay informacion disponible",
    };

    render() {
        const {
            title, items, emptyMessage, children,
        } = this.props;
        const hasItems = items.length > 0;
        return (
            <View style={ [ styles.container, this.props.style ] }>
                <HR />
                <View style={ styles.segmentWrapper }>
                    <Text style={ styles.segmentTitle }>{title}</Text>
                    <View style={ styles.segmentContent }>
                        {!hasItems && <SegmentItem text={ emptyMessage } />}
                        {children}
                    </View>
                </View>
            </View>
        );
    }
}
