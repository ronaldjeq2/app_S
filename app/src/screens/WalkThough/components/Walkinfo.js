import React from "react";
import { Text, Image, View,TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Button } from "../../../components/Buttons";

import styles from "../styles";

const WalkInfo = ( {
    tittleSteep, descriptionSteep, icon, step,isFinalWalk,handleEndWalk,handleNextSlideButton
} ) => (
    <View style={ styles.slide }>
        <TouchableOpacity onPress={handleEndWalk} style={styles.skipButton}>
            <Text style={styles.skipText}>{isFinalWalk ? "FINALIZAR" : "SALTAR"}</Text>
        </TouchableOpacity>
        <View style={styles.containerInfo} >
            <View style={ [ styles.wrapperImage, { marginTop: ( step = 2 ? 20 : 5 ) } ] }>
                <Image style={ styles.image } source={ icon } resizeMode="contain" />
            </View>
            <View style={ styles.contentTextWalk }>
                <Text style={ styles.titleWalk }>{tittleSteep}</Text>
                <Text style={ styles.textWalk }>{descriptionSteep}</Text>
            </View>
        </View>
        <View style={ styles.containerTextHandler }>
        { isFinalWalk ? (
            <Text style={styles.textButton} onPress={handleEndWalk}>FINALIZAR</Text>
            ):(
            <Text style={styles.textButton} onPress={handleNextSlideButton}>SIGUIENTE</Text>    
            )}
        </View>
    </View>
);

WalkInfo.propTypes = {
    tittleSteep: PropTypes.string.isRequired,
    descriptionSteep: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    isFinalWalk: PropTypes.bool.isRequired,
    handleEndWalk: PropTypes.func.isRequired,
    handleNextSlideButton: PropTypes.func.isRequired,

};

export default WalkInfo;
