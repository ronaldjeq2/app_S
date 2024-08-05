import React from "react";
import { Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import { colors } from "../../config/styles";
import "./Buttons.css";

const styles = {
  ButtonValidate: {
    //backgroundColor: colors.primaryColor,
    color: colors.white
  }
};

const BlueButtonWhiteText = ({
  buttonText,
  showModal,
  isDisabled,
  buttonTextDisabled
}) => {
  return (
    <Button
      style={styles.ButtonValidate}
      onClick={showModal}
      className="validateButtonText"
      disabled={isDisabled}
      basic={isDisabled}
      color={!isDisabled ? "blue" : "grey"}
    >
      {isDisabled ? buttonTextDisabled : buttonText}
    </Button>
  );
};

BlueButtonWhiteText.propTypes = {
  buttonText: PropTypes.string.isRequired,
  showModal: PropTypes.func,
  isActiveButton: PropTypes.bool,
  buttonTextDisabled: PropTypes.string
};
export default BlueButtonWhiteText;
