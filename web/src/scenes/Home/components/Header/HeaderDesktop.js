import React, { Component } from "react";
import {
    Button,
    Image,
    Icon,
    Menu,
    Responsive,
    Container
} from "semantic-ui-react";
import PropTypes from "prop-types";

import HeaderUser from "./HeaderUser";

class HeaderDesktop extends Component {
    static propTypes = {
        activeItem: PropTypes.string,
        handleLogout: PropTypes.func,
        userDetail: PropTypes.object,
        existError: PropTypes.bool
    };

    render() {
        const { userDetail, handleLogout, existError } = this.props;
        return (
            <Responsive id="headerDesktop" minWidth={Responsive.onlyTablet.minWidth}>
                <Menu pointing secondary attached>
                    <Container>
                        <Menu.Item>
                            <Image
                                src={`${process.env.REACT_APP_PUBLIC_URL}/logo.png`}
                                verticalAlign="top"
                                style={{ width: 150 }}
                            />
                        </Menu.Item>

                        <Menu.Item>
                            {existError ? (
                                <span>No se pudo actualizar la información </span>
                            ) : (
                                    <HeaderUser userDetail={userDetail} />
                                )}
                        </Menu.Item>

                        <Menu.Menu position="right">
                            <Menu.Item>
                                <Button basic icon labelPosition="right" onClick={handleLogout}>
                                    Cerrar sesión
                  <Icon name="power" />
                                </Button>
                            </Menu.Item>
                        </Menu.Menu>
                    </Container>
                </Menu>
            </Responsive>
        );
    }
}

export default HeaderDesktop;
