import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import history from "../../../../services/history";
import { sendEmailCode, validateEmailCode } from "../../../../actions/email";
import VerifyComponent from "../../components/VerifyComponent";
import Swal from "sweetalert2";

const EmailValidationObject = {
    tittleScene: " VALIDACIÒN DE CORREO",
    question: "¿Correo equivocado?",
    textLink: "Valida otro correo",
    imgSource: `${process.env.REACT_APP_PUBLIC_URL}/correo.png`,
    comment:
        "Recuerda que si tienes un correo incorrecto, lo debes eliminar en el menú Principal"
};

class Validation extends PureComponent {
    static propTypes = {
        dispatch: PropTypes.func,
        emailToValidate: PropTypes.string,
        isValidating: PropTypes.bool
    };
    state = {
        value: ""
    };
    componentDidMount() {
        const { emailToValidateInfo } = this.props;
        const { email_address, is_verified } = emailToValidateInfo;
        if (email_address === undefined || is_verified) {
            return history.push(`${process.env.REACT_APP_PUBLIC_URL}/`);
        }
    }
    backScene() {
        history.goBack();
    }
    ValidateItem() {
        const { value } = this.state;
        const EmailCode = value;
        const { dispatch } = this.props;
        if (EmailCode.length === 6) {
            dispatch(validateEmailCode(EmailCode));
        } else {
            Swal.fire({
                type: "error",
                title: "Oops...",
                text: `el código debe tener 6 caracteres`
            });
        }
    }

    retrySendEmail() {
        const { dispatch, emailToValidateInfo } = this.props;
        const showAlert = true;
        dispatch(sendEmailCode(emailToValidateInfo, showAlert));
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    activateReSendCode() { }
    render() {
        const { emailToValidateInfo, isValidating } = this.props;
        const { email_address } = emailToValidateInfo;

        return (
            <VerifyComponent
                isValidating={isValidating}
                DescriptionValidationObject={EmailValidationObject}
                validateCode={() => {
                    this.ValidateItem();
                }}
                changeInput={e => {
                    this.handleChange(e);
                }}
                backScene={() => {
                    this.backScene();
                }}
                itemToValidate={email_address}
                reSendCode={() => {
                    this.retrySendEmail();
                }}
                activateReSendCode={() => {
                    this.activateReSendCode();
                }}
            />
        );
    }
}
const mapStateToProps = state => {
    const { isValidating, emailToValidateInfo } = state.email;

    return {
        emailToValidateInfo,
        isValidating
    };
};
export default connect(mapStateToProps)(Validation);
