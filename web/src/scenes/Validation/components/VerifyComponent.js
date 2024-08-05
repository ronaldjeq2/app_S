import React from "react";
import { Button, Grid, Image, Label, Form } from "semantic-ui-react";
//import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { colors } from "../../../config/styles";
const styles = {
  container: {
    width: "80%",
    backgroundColor: colors.white,
    marginLeft: 150
  },
  tittle: {
    fontSize: 20,
    backgroundColor: colors.white,
    color: colors.primaryColor
  },
  options: {
    fontSize: 20,
    marginLeft: 20
  },
  image: {
    height: 60,
    marginTop: 10,
    marginRight: 10
  }
};

const VerifyComponent = ({
  backScene,
  changeInput,
  DescriptionValidationObject,
  itemToValidate,
  reSendCode,
  validateCode,
  isValidating
}) => {
  const {
    tittleScene,
    question,
    textLink,
    comment,
    imgSource
  } = DescriptionValidationObject;
  return (
    <Grid
      style={{
        marginTop: 20
      }}
    >
      <Grid.Row>
        <Label style={styles.tittle}>{tittleScene}</Label>
      </Grid.Row>
      <Grid.Row style={styles.options}>
        <span style={{ marginTop: 16, marginRight: 10, fontWeight: "bold" }}>
          Mensaje enviado
        </span>
      </Grid.Row>
      <Grid.Row style={{ marginLeft: 20 }}>
        <Image
          src={imgSource}
          // className="Logo-header"
          verticalAlign="middle"
          style={styles.image}
        />
        <span style={{ marginTop: 16, marginRight: 12, fontWeight: "bold" }}>
          Ingresa el código de verificación enviado a: {itemToValidate}
          <br />
          {question}
          {!isValidating && (
            <span
              style={{
                color: colors.primaryColor,
                textDecorationLine: "underline",
                marginLeft: 10,
                cursor: "pointer"
              }}
              onClick={backScene}
            >
              {textLink}
            </span>
          )}
        </span>
      </Grid.Row>
      <Grid.Row>
        <Form.Input
          id="data"
          name="data"
          required
          maxLength="6"
          autoComplete="off"
          placeholder={"Ingrese el código de verificación"}
          style={{
            marginLeft: 20,
            fontSize: 15,
            width: 260,
            fontWeight: "bold",
            border: "none",
            borderBottom: "2px solid #7A8085"
          }}
          onChange={changeInput}
        />
      </Grid.Row>
      <Grid.Row style={{ marginLeft: 20 }}>
        <Button
          style={{
            backgroundColor: colors.primaryColor,
            color: colors.white,
            fontSize: 15

            //marginTop: 8
          }}
          onClick={validateCode}
          loading={isValidating}
        >
          VALIDAR
        </Button>
      </Grid.Row>
      <Grid.Row>
        <span
          style={{
            marginTop: 16,
            marginLeft: 20,
            fontWeight: "bold",
            fontSize: 20
          }}
        >
          ¿No recibiste el código?
        </span>
      </Grid.Row>
      <Grid.Row>
        <span
          style={{
            marginTop: 16,
            marginLeft: 20,
            fontSize: 15
          }}
        >
          {!isValidating && (
            <span
              style={{
                color: colors.primaryColor,
                textDecorationLine: "underline",
                cursor: "pointer"
              }}
              onClick={reSendCode}
            >
              Intenta de nuevo
            </span>
          )}
        </span>
      </Grid.Row>
      <Grid.Row>
        <span
          style={{
            marginTop: 16,
            marginLeft: 20,
            fontSize: 15
          }}
        >
          {comment}
        </span>
      </Grid.Row>
    </Grid>
  );
};

VerifyComponent.propTypes = {
  DescriptionValidationObject: PropTypes.object.isRequired,
  itemToValidate: PropTypes.string.isRequired,
  backScene: PropTypes.func.isRequired,
  changeInput: PropTypes.func.isRequired,
  reSendCode: PropTypes.func.isRequired,
  validateCode: PropTypes.func.isRequired,
  isValidating: PropTypes.bool.isRequired
};
export default VerifyComponent;
