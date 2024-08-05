import React from "react";
import {
    View, Image, Text
} from "react-native";
import PropTypes from "prop-types";
import styles from "../../styles";
import { colors } from "../../../../config/styles";

const Credential = ( {
    data
} ) => (
        <View style={ styles.infoStudent }>
                <Image
                    source={ require( "../../images/circle-person-active.png" ) }
                    style={ styles.imageperson }
                />
                <View style={ styles.viewDate }>
                    <Text style={ { fontWeight: "bold" } }>
                        {data.firstName}
                        {" "}
                        {data.middleName && data.middleName}
                    </Text>
                    <Text>{data.lastName}</Text>
                    <Text>
                        {data.docType}
                        {" : "}
                        {data.numDoc}
                    </Text>
                    <Text style={ { color: colors.$lighterBlue } }>
                        {"ID: "}
                        {data.id}
                    </Text>
                </View>
            </View>
);

Credential.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Credential;

