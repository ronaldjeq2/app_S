import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import EmailList from "./Email/EmailList";
import "./List.css";
import PhoneList from "./Phone/PhoneList";

class List extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isFetching: PropTypes.bool,
    hasError: PropTypes.bool,
    errorMessage: PropTypes.string
  };

  componentDidMount() {}
  render() {
    return (
      <div id="UserInfoScene">
        <Grid>
          <Grid.Row>
            <Grid.Column only="tablet computer" tablet={1} computer={1} />
            <Grid.Column mobile={16} tablet={14} computer={14}>
              <EmailList />
              <PhoneList />
            </Grid.Column>
            <Grid.Column only="tablet computer" tablet={1} computer={1} />
          </Grid.Row>
        </Grid>
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
export default connect(mapStateToProps)(List);
