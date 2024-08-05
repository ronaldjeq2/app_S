import React from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Typebutton from "../Typebutton";

const styles = {
    selectedFill: {
        width: 100,
        height: 25,
        marginLeft: 15,
        borderRadius: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
};

const FilterButton = ( {
    activeButton, colorText, onPress, textButton,
} ) => (
    <TouchableOpacity
        onPress={ onPress }
        style={ [ styles.selectedFill, { backgroundColor: activeButton ? colorText : "#D3D9E0" } ] }
    >
        <Typebutton text={ textButton } active={ activeButton } />
    </TouchableOpacity>
);

FilterButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    colorText: PropTypes.string.isRequired,
    textButton: PropTypes.string.isRequired,
    activeButton: PropTypes.bool.isRequired,
};

export default FilterButton;
