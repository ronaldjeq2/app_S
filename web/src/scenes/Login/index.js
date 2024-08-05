import React, { Component } from "react";
import { Button, Form, Grid, Image, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import { loginRequest } from "../../actions/session";

import "./index.css";

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isFetching: PropTypes.bool,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string
  };

  handleSubmit = event => {
    const { dispatch } = this.props;

    event.stopPropagation();
    event.preventDefault();

    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    dispatch(loginRequest(username, password));
  };

  render() {
    const { hasError, errorMessage, isFetching } = this.props;

    return (
      <Grid id="loginWrapper" centered verticalAlign="middle">
        <Grid.Column id="login">
          <Grid centered columns="equal">
            {/* LOGO */}
            <Grid.Column
              verticalAlign="middle"
              computer="6"
              tablet="6"
              mobile="16"
            >
              <Image
                src={`${process.env.REACT_APP_PUBLIC_URL}/logo-vertical.svg`}
                size="medium"
                centered
                style={{ width: "100px" }}
              />
            </Grid.Column>

            {/* LOGIN FORM */}
            <Grid.Column
              verticalAlign="middle"
              tablet="10"
              computer="10"
              mobile="16"
            >
              <Form
                id="loginForm"
                warning={hasError}
                onSubmit={this.handleSubmit}
              >
                <Message warning>
                  <div className="content">
                    <p>
                      <i aria-hidden="true" className="warning sign icon" />
                      {` ${errorMessage}`}
                    </p>
                  </div>
                </Message>
                <Form.Field disabled={isFetching}>
                  <input
                    id="username"
                    required
                    autoComplete="off"
                    maxLength="9"
                    placeholder="Ingresa tu ID"
                  />
                </Form.Field>
                <Form.Field disabled={isFetching}>
                  <input
                    id="password"
                    required
                    autoComplete="off"
                    minLength="6"
                    maxLength="15"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                  />
                </Form.Field>

                <Button inverted fluid loading={isFetching}>
                  INGRESAR
                </Button>
                {/* <Link to={`${process.env.PUBLIC_URL}/recovery`}>
                  ¿Olvidaste tu contraseña?
                </Link> */}
              </Form>
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  const { hasError, errorMessage, isFetching } = state.session;
  return {
    hasError,
    errorMessage,
    isFetching
  };
};
export default connect(mapStateToProps)(Login);
