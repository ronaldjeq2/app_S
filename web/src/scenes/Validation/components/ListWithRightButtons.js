import React from "react";
import { Button, Grid, Icon, Container } from "semantic-ui-react";
import PropTypes from "prop-types";

import "./ListWithRightButtons.css";
import { colors } from "../../../config/styles";
import { BlueButtonWhiteText } from "../../../components/Button";

const ListWithRightButtons = ({
  value,
  categoryValue,
  showModal,
  validateButtonIsActive,
  deleteElement
}) => {
  return (
    <Grid id="ListWithRightButtons" centered verticalAlign="middle">
      <Grid.Column floated="left" width="10">
        <Container>
          <p className="itemText">{value}</p>
          <p>{categoryValue}</p>
        </Container>
      </Grid.Column>

      <Grid.Column width="6" textAlign="right" className="containerButtons">
        <BlueButtonWhiteText
          buttonText="VALIDAR"
          buttonTextDisabled="VALIDADO"
          showModal={showModal}
          isDisabled={validateButtonIsActive}
        />
        <Button
          onClick={deleteElement}
          icon
          style={{ backgroundColor: colors.white }}
        >
          <Icon name="trash" color="grey" />
        </Button>
      </Grid.Column>
    </Grid>
  );
};
ListWithRightButtons.propTypes = {
  value: PropTypes.string.isRequired,
  categoryValue: PropTypes.string,
  showModal: PropTypes.func.isRequired,
  validateButtonIsActive: PropTypes.bool.isRequired,
  deleteElement: PropTypes.func
};

export default ListWithRightButtons;
