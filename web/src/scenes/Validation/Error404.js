import React, { Component } from "react";

import { Grid, Message, Button } from "../../../node_modules/semantic-ui-react";

import history from "../../services/history";
class ErrorMessageView extends Component {
  componentDidMount() {}
  goHome() {
    history.push(`${process.env.PUBLIC_URL}/`);
  }
  render() {
    const { textMessage } = this.props;
    return (
      <Grid style={{ marginTop: 20 }} centered>
        <Grid.Row>
          <Message
            info
            header={
              textMessage
                ? textMessage
                : "No se encontró  información en la página solicitada"
            }
          />
        </Grid.Row>
        <Grid.Row>
          <Button color="blue" onClick={() => this.goHome()}>
            Ir al Inicio
          </Button>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ErrorMessageView;
