import React, { Component } from "react";
import { Image, Icon, Menu, Responsive, Sidebar } from "semantic-ui-react";

import PropTypes from "prop-types";

import { colors } from "../../../../config/styles";
import HeaderUser from "./HeaderUser";

class HeaderMobile extends Component {
    static propTypes = {
        sidebarOpened: PropTypes.bool,
        handleLogout: PropTypes.func,
        userDetail: PropTypes.object
    };

    state = { sidebarOpened: false };

    hideSidebar = () => this.setState({ sidebarOpened: false });
    showSidebar = () => this.setState({ sidebarOpened: true });

    render() {
        const { sidebarOpened } = this.state;
        const { userDetail, handleLogout } = this.props;

        return (
            <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                <Sidebar
                    as={Menu}
                    animation="overlay"
                    onHide={this.hideSidebar}
                    vertical
                    visible={sidebarOpened}
                >
                    <Menu.Item as="a" onClick={handleLogout}>
                        Cerrar Sesión
          </Menu.Item>
                </Sidebar>

                <Sidebar.Pusher
                    dimmed={sidebarOpened}
                    style={{
                        backgroundColor: colors.primaryColor,
                        padding: "10px 0px"
                    }}
                >
                    <Icon
                        onClick={this.showSidebar}
                        size="big"
                        name="sidebar"
                        style={{
                            color: colors.white,
                            marginLeft: 30
                        }}
                    />
                    <Image
                        src={`${process.env.REACT_APP_PUBLIC_URL}/logoWhite.png`}
                        verticalAlign="middle"
                        style={{ maxWidth: 150 }}
                    />
                </Sidebar.Pusher>

                <HeaderUser userDetail={userDetail} />
            </Responsive>
        );
    }
}

export default HeaderMobile;
