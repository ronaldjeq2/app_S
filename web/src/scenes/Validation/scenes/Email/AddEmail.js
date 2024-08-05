import React, { Component } from "react";
import {
  Button,
  Grid,
  Label,
  Dropdown,
  Input,
  Message
} from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import history from "../../../../services/history";
import { hideMessage, showMessage } from "../../../../actions/error";
import { addEmail, getListTypesEmail } from "../../../../actions/email";
import { colors } from "../../../../config/styles";
import "../../components/AddValue.css";
import LoaderComponent from "../../../../components/Loader/loader";
const styles = {
  tittle: {
    fontSize: 20,
    backgroundColor: colors.white,
    color: colors.primaryColor
  },
  textInfo: { marginTop: 16, marginRight: 10 },
  options: {
    fontSize: 20,
    marginLeft: 20
  },
  send: {
    backgroundColor: colors.$BlueIndicator
  },
  cancel: {
    backgroundColor: colors.$senatiWhite,
    border: "1px solid black"
  }
};

class AddEmail extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isValidating: PropTypes.bool,
    errorMessage: PropTypes.string,
    showMessageError: PropTypes.bool,
    typeEmailList: PropTypes.array,
    isLoadingList: PropTypes.bool
  };

  state = {
    value: "",
    typeItem: null,
    errorEmail: false,
    errorDropDown: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getListTypesEmail());
  }
  handleChangeEmail(event) {
    this.setState({ value: event.target.value });
  }
  onChangeDropDown = (e, data) => {
    this.setState({ typeItem: data.value });
  };
  changeScreen(typeButton) {
    const { dispatch } = this.props;
    const { value, typeItem } = this.state;

    if (typeButton === "cancelar") {
      //dispatch(showMessage(false, null));
      history.goBack();
    } else {
      const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
      let emailValid = formatEmail.test(value);

      if (typeItem === null) {
        this.setState({ errorDropDown: true });
      } else if (!emailValid) {
        this.setState({ errorEmail: true });
        dispatch(showMessage("el correo ingresado no es válido"));
      } else {
        this.setState({ errorEmail: false, errorDropDown: false });
        dispatch(addEmail(value, typeItem));
      }
    }
  }

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.changeScreen("enviar");
    }
  };
  componentWillUnmount() {
    this.props.dispatch(hideMessage());
  }
  render() {
    const {
      isValidating,
      showMessageError,
      errorMessage,
      typeEmailList,
      isLoadingList
    } = this.props;
    const { errorEmail, errorDropDown } = this.state;
    if (isLoadingList) {
      return <LoaderComponent />;
    }
    const options = [];
    typeEmailList.map(item => {
      options.push({
        key: item.email_type_code,
        text: item.email_type_description,
        value: item.email_type_code
      });
    });
    return (
      <Grid style={{ marginTop: 20 }} id="addItem" className="addItemContainer">
        <Grid.Row>
          <Label style={styles.tittle}>AGREGAR CORREOS</Label>
        </Grid.Row>
        <Grid.Row style={styles.options}>
          <Dropdown
            placeholder="Seleccione el tipo de correo"
            selection
            error={errorDropDown}
            options={options}
            //value={typeItem}
            onChange={this.onChangeDropDown}
            style={{ fontSize: 14 }}
          />
        </Grid.Row>
        <Grid.Row>
          <Input
            error={errorEmail}
            id="data"
            name="data"
            required
            value={this.state.value}
            placeholder="Correo electrónico"
            maxLength="129"
            autoComplete="off"
            style={{
              marginLeft: 20,
              fontSize: 15,
              width: 260,
              fontWeight: "bold",
              border: "none",
              borderBottom: "2px solid #7A8085"
            }}
            onChange={e => {
              this.handleChangeEmail(e);
            }}
            onKeyPress={this._handleKeyPress}
          />
        </Grid.Row>
        {(errorEmail || showMessageError) && (
          <Grid.Row style={{ marginLeft: 20 }}>
            <Message error content={errorMessage} />
          </Grid.Row>
        )}
        <Grid.Row style={{ marginLeft: 20 }}>
          <Button
            fluid
            style={styles.cancel}
            onClick={() => {
              this.changeScreen("cancelar");
            }}
            className="Button_AddItem"
            disabled={isValidating}
          >
            CANCELAR
          </Button>

          <Button
            color="blue"
            fluid
            style={styles.send}
            onClick={() => {
              this.changeScreen("enviar");
            }}
            className="Button_AddItem"
            loading={isValidating}
            disabled={isValidating}
          >
            ENVIAR
          </Button>
        </Grid.Row>

        <Grid.Row />
      </Grid>
    );
  }
}
const mapStateToProps = state => {
  const { isValidating, typeEmailList, isLoadingList } = state.email;
  const { errorMessage, showMessageError } = state.error;

  return {
    isValidating,
    errorMessage,
    showMessageError,
    typeEmailList,
    isLoadingList
  };
};
export default connect(mapStateToProps)(AddEmail);
