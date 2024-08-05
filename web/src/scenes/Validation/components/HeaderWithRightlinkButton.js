import React from "react";
import { Grid, Icon, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { colors } from "../../../config/styles";
const styles = {
  containerHeader: {
    backgroundColor: colors.primaryColor,
    display: "flex",
    alignItems: "center"
  },
  tittle: {
    color: colors.white,
    fontWeight: "bold"
  },

  textLink: {
    color: colors.white,
    textDecorationLine: "underline",
    marginRight: 10
  }
};

const HeaderWithRightLinkButton = ({ elementDetails }) => {
  const { tittle, pathIndicator, linkTextFragment } = elementDetails;

  return (
    <Grid style={styles.containerHeader}>
      <Grid.Column floated="left" width="10">
        <Container>
          <p style={styles.tittle}>{tittle}</p>
        </Container>
      </Grid.Column>

      <Grid.Column width="6">
        <Link
          to={`${process.env.PUBLIC_URL}/${pathIndicator}/agregar`}
          style={{
            whiteSpace: "nowrap",
            float: "right"
          }}
        >
          <span style={styles.textLink}>Agregar {linkTextFragment}</span>
          <Icon name="plus circle" size="big" className="iconAdd white" />
        </Link>
      </Grid.Column>
    </Grid>
  );
};

HeaderWithRightLinkButton.propTypes = {
  elementDetails: PropTypes.object.isRequired
};
export default HeaderWithRightLinkButton;
