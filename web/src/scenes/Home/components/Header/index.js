import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import { accountRequestInfoAction } from "../../../../actions/user";

import "./index.css";
import { Menu, Container, Grid } from "semantic-ui-react";
import Loader from "../../../../components/Loader/loader";

class Header extends Component {
  static propTypes = {
    handleLogout: PropTypes.func,
    user: PropTypes.object,
    isLoading: PropTypes.bool,
    existError: PropTypes.bool
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(accountRequestInfoAction());
  }
  render() {
    const { handleLogout, user, isLoading, existError } = this.props;
    if (isLoading || user === undefined) {
      return (
        <Grid centered>
          <Loader />;
        </Grid>
      );
    }
    return (
      <div>
        <HeaderDesktop
          userDetail={user}
          existError={existError}
          handleLogout={handleLogout}
        />

        <HeaderMobile
          userDetail={user}
          existError={existError}
          handleLogout={handleLogout}
        />

        <Menu
          attached
          secondary
          pointing
          color={"blue"}
          style={{ backgroundColor: "#F2F3F5" }}
        >
          <Container>
            <Menu.Menu>
              <NavLink
                className="item"
                activeClassName="active"
                to={`${process.env.PUBLIC_URL}/`}
              >
                Datos personales
              </NavLink>
            </Menu.Menu>
          </Container>
        </Menu>
      </div>

      //   <Responsive as={Segment} minWidth={992}>
      //     Visible only if display has <code>992px</code> width and higher
      //   </Responsive>
    );
  }
}
const mapStateToProps = state => {
  const { isLoading, existError } = state.user;
  const user = state.user;

  return {
    isLoading,
    user,
    existError
  };
};
export default connect(mapStateToProps)(Header);
