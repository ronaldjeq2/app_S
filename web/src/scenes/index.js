import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter, Route } from "react-router-dom";

import { getStoredToken } from "../actions/session";

import Login from "./Login";
import Home from "./Home";

/**
 * TODO
 * - Test when token expiration
 */

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isLogged: PropTypes.bool
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getStoredToken());
  }

  render() {
    const { isLogged } = this.props;
    if (!isLogged) {
      return <Login />;
    }
    return (
      <div>
        <Route path={`${process.env.PUBLIC_URL}/`} component={Home} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { isLogged } = state.session;
  return {
    isLogged
  };
};
export default withRouter(connect(mapStateToProps)(App));
