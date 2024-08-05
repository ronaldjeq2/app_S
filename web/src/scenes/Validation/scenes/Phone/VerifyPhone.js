import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import history from "../../../../services/history";
import { sendPhoneCode, validatePhoneCode } from "../../../../actions/phone";

import VerifyComponent from "../../components/VerifyComponent";
import Swal from "sweetalert2";
const PhoneValidationObject = {
  tittleScene: "VALIDACIÓN DE TELÉFONO",
  question: "Teléfono equivocado?",
  textLink: "Valida otro teléfono",
  imgSource: `${process.env.PUBLIC_URL}/teléfono.png`,
  comment:
    "Recuerda que si tienes un teléfono incorrecto, lo debes eliminar en el menú Principal"
};

class Validation extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    phoneToValidateInfo: PropTypes.object,
    isValidating: PropTypes.bool
  };
  state = {
    value: ""
  };

  componentDidMount() {
    const { phoneToValidateInfo } = this.props;
    const { phone_number, is_verified } = phoneToValidateInfo;
    if (phone_number === undefined || is_verified) {
      return history.push(`${process.env.PUBLIC_URL}/`);
    }
  }
  backScene() {
    history.goBack();
  }
  ValidateItem() {
    const { value } = this.state;
    const PhoneCode = value;
    const { dispatch } = this.props;
    if (PhoneCode.length === 6) {
      dispatch(validatePhoneCode(PhoneCode));
    } else {
      Swal.fire({
        type: "error",
        title: "Oops...",
        text: `el código debe tener 6 caracteres`
      });
    }
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  retrySendPhone() {
    const { dispatch, phoneToValidateInfo } = this.props;
    const showAlert = true;
    dispatch(sendPhoneCode(phoneToValidateInfo, showAlert));
  }

  render() {
    const { isValidating, phoneToValidateInfo } = this.props;
    const { phone_number } = phoneToValidateInfo;

    return (
      <VerifyComponent
        isValidating={isValidating}
        DescriptionValidationObject={PhoneValidationObject}
        validateCode={() => {
          this.ValidateItem();
        }}
        changeInput={e => {
          this.handleChange(e);
        }}
        backScene={() => {
          this.backScene();
        }}
        itemToValidate={phone_number}
        reSendCode={() => {
          this.retrySendPhone();
        }}
      />
    );
  }
}
const mapStateToProps = state => {
  const { isValidating, phoneToValidateInfo } = state.phone;

  return {
    isValidating,
    phoneToValidateInfo
  };
};
export default connect(mapStateToProps)(Validation);
