import React from "react";
import { Header, Image } from "semantic-ui-react";

import "./HeaderUser.css";

const UserInfo = ({ userDetail }) => {
    const { docType, firstName, id, numDoc, lastName } = userDetail;
    return (
        <Header as="h2" id="HeaderUser">
            <Image src={`${process.env.PUBLIC_URL}/user.png`} />
            <Header.Content>
                <span>{`${firstName} ${lastName}`}</span>
                <Header.Subheader>
                    {`ID: ${id} | ${docType}: ${numDoc}`}
                </Header.Subheader>
            </Header.Content>
        </Header>
    );
};

UserInfo.propTypes = {};

export default UserInfo;
