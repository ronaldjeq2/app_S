import React from "react";
import PropTypes from "prop-types";
import { Button, Image, Modal } from "semantic-ui-react";

import "./ModalSendMessage.css";
import { colors } from "../../config/styles";

const styles = {
  image: {
    height: 150,
    marginTop: 10
  },
  send: {
    width: 200,
    backgroundColor: colors.primaryColor,
    fontSize: "1rem",
    textAlign: "center"
  },
  cancel: {
    width: 200,
    backgroundColor: colors.white,
    border: "0.2rem solid black",
    textAlign: "center",
    fontSize: "1rem"
  }
};
const ModalSendMessage = ({
  modalIsActive,
  closeModal,
  modalIndicator,
  textModalInfo,
  imageModal,
  validateItem,
  isValidating
}) => {
  return (
    <Modal
      style={{ textAlign: "center" }}
      size="small"
      open={modalIsActive}
      onClose={closeModal}
      id="ModalSendMessage"
    >
      <Modal.Content image style={{ textAlign: "center" }}>
        <Image
          src={`${process.env.PUBLIC_URL}/${imageModal}.png`}
          // className="Logo-header"
          verticalAlign="middle"
          className="image"
          style={styles.image}
          centered
        />
        <Modal.Description>
          <br />
          <p>
            Te enviaremos un mensaje de {textModalInfo} para validar su
            autenticidad.
          </p>
          {modalIndicator === "mobile" && (
            <p>
              Este mensaje es gratuito pero podría tener un costo por parte de
              tu operador.
            </p>
          )}
          <span>¿Deseas continuar?</span>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions
        style={{
          backgroundColor: colors.white
        }}
      >
        <Button
          loading={isValidating}
          color="blue"
          style={styles.send}
          onClick={validateItem}
          disabled={isValidating}
        >
          ENVIAR
        </Button>
        <Button
          loading={isValidating}
          style={styles.cancel}
          onClick={closeModal}
          disabled={isValidating}
        >
          CANCELAR
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
ModalSendMessage.prototype = {
  modalIsActive: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalIndicator: PropTypes.string.isRequired,
  textModalInfo: PropTypes.string.isRequired,
  imageModal: PropTypes.string.isRequired,
  validateItem: PropTypes.func.isRequired,
  isValidating: PropTypes.bool
};
export default ModalSendMessage;
