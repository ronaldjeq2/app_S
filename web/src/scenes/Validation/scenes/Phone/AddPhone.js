import React, { Component } from "react";
import { Button, Grid, Label, Input, Message } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import history from "../../../../services/history";
import { addPhone } from "../../../../actions/phone";
import { hideMessage } from "../../../../actions/error";

import "../../components/AddValue.css";

import { colors } from "../../../../config/styles";

const styles = {
    tittle: {
        fontSize: 20,
        backgroundColor: colors.white,
        color: colors.primaryColor
    },
    textInfo: { marginTop: 16, marginRight: 10 },
    options: {
        fontSize: 20,
        marginLeft: 20
    },
    send: {
        backgroundColor: colors.$BlueIndicator
    },
    cancel: {
        backgroundColor: colors.$senatiWhite,
        border: "1px solid black"
    }
};

class AddPhone extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        isValidating: PropTypes.bool,
        errorMessage: PropTypes.string,
        showMessageError: PropTypes.bool
    };

    state = {
        value: "",
        errorPhone: false
    };

    componentDidMount() { }
    handleChangePhone(event) {
        /*     const isNumber = text === "" || /^9[0-9]*$/.test(text);
        var formatPhone = /^\d{9}(?:[-\s]\d{4})?$/;
        let phoneValid = text !== "" && formatPhone.test(event.target.value);
        if (isNumber) { */
        this.setState({ value: event.target.value });
        /*     } */
    }

    changeScreen(typeButton) {
        const { dispatch } = this.props;
        const { value } = this.state;
        let errorPhone = false;

        if (typeButton === "cancelar") {
            history.goBack();
        } else {
            const isNumber = /^9[0-9]{8}$/.test(value);
            if (isNumber) {
                dispatch(addPhone(value));
            } else {
                errorPhone = true;
            }
            this.setState({ errorPhone });
        }
    }

    _handleKeyPress = e => {
        if (e.key === "Enter") {
            this.changeScreen("enviar");
        }
    };
    componentWillUnmount() {
        this.props.dispatch(hideMessage());
    }
    render() {
        const { errorMessage, tittle, showMessageError, isValidating } = this.props;
        const { errorPhone } = this.state;
        return (
            <Grid style={{ marginTop: 20 }} id="addItem" className="addItemContainer">
                <Grid.Row>
                    <Label style={styles.tittle}>AGREGAR {tittle}</Label>
                </Grid.Row>
                <Grid.Row style={styles.options}>
                    <span style={styles.textInfo} className="textDropInfo">
                        Ingresa un teléfono celular
                    </span>
                </Grid.Row>
                <Grid.Row>
                    <Input
                        id="data"
                        name="data"
                        // type={tittle === "CORREOS" ? "email" : "number"}
                        required
                        value={this.state.value}
                        placeholder="Número telefónico"
                        maxLength="9"
                        autoComplete="off"
                        error={errorPhone}
                        style={{
                            marginLeft: 20,
                            fontSize: 15,
                            width: 260,
                            fontWeight: "bold",
                            border: "none",
                            borderBottom: "2px solid #7A8085"
                        }}
                        onChange={e => {
                            this.handleChangePhone(e);
                        }}
                        onKeyPress={this._handleKeyPress}
                    />
                </Grid.Row>
                {(errorPhone || showMessageError) && (
                    <Grid.Row style={{ marginLeft: 20 }}>
                        <Message
                            error
                            content={
                                showMessageError
                                    ? errorMessage
                                    : "el número de celular debe tener 9 dígitos y empezar en 9"
                            }
                        />
                    </Grid.Row>
                )}

                <Grid.Row style={{ marginLeft: 20 }}>
                    <Button
                        fluid
                        style={styles.cancel}
                        onClick={() => {
                            this.changeScreen("cancelar");
                        }}
                        disabled={isValidating}
                        className="Button_AddItem"
                    >
                        CANCELAR
          </Button>
                    <Button
                        color="blue"
                        fluid
                        style={styles.send}
                        disabled={isValidating}
                        onClick={() => {
                            this.changeScreen("enviar");
                        }}
                        className="Button_AddItem"
                        loading={isValidating}
                    >
                        ENVIAR
          </Button>
                </Grid.Row>

                <Grid.Row />
            </Grid>
        );
    }
}
const mapStateToProps = state => {
    const { isValidating } = state.phone;

    const { errorMessage, showMessageError } = state.error;

    return {
        errorMessage,
        showMessageError,
        isValidating
    };
};
export default connect(mapStateToProps)(AddPhone);
