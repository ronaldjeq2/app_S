import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import { Header } from "./components";

import Validation from "../Validation";

import "./index.css";
import { Container } from "semantic-ui-react";
import { logoutRequest } from "../../actions/session";

class Home extends Component {
  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(logoutRequest());
  };

  render() {
    return (
      <div id="home">
        <Header handleLogout={() => this.handleLogout()} />
        <Container>
          {/*   <Validation />*/}
          <Switch>
            <Route
              path={`${process.env.REACT_APP_PUBLIC_URL}/`}
              component={Validation}
            />
          </Switch>
        </Container>
        <div class="ui vertical footer segment">
          <div class="ui container center aligned ">
            Para cualquier inconveniente, enviar un correo con tus datos a
            app@senati.edu.pe
          </div>
        </div>
      </div>
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
export default connect(mapStateToProps)(Home);
