import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Segment, Grid } from "semantic-ui-react";
import { sendPhoneCode, deletePhone } from "../../../../actions/phone";
import { getListPhones } from "../../../../actions/phone";
import HeaderWithRightLinkButton from "../../components/HeaderWithRightlinkButton";
import ListWithRightButtons from "../../components/ListWithRightButtons";
import { ModalSendMessage } from "../../../../components/Modal";
import Loader from "../../../../components/Loader/loader";
import Swal from "sweetalert2";

const phoneElements = {
  tittle: "TELÉFONOS",
  pathIndicator: "telefono",
  linkTextFragment: "teléfono",
  modalType: "mobile",
  textInfo: "texto al número ingresado",
  imageModal: "mobile"
};
class PhoneList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    phoneList: PropTypes.array,
    isLoading: PropTypes.bool
  };
  state = {
    modalIsActive: false,
    valueToVerify: null
  };
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(getListPhones());
  }
  showModal = phone_id => {
    this.setState({
      modalIsActive: true,
      valueToVerify: phone_id
    });
  };
  closeModal = () => {
    this.setState({
      modalIsActive: false
    });
  };
  validateItem = () => {
    const { phoneList } = this.props;

    const { valueToVerify } = this.state;
    const showAlert = false;
    const phoneInfoResult = phoneList.find(
      phoneInfo => phoneInfo.phone_id === valueToVerify
    );
    this.setState(
      {
        modalIsActive: false
      },
      () => this.props.dispatch(sendPhoneCode(phoneInfoResult, showAlert))
    );
  };

  deleteItem = phone_id => {
    Swal.fire({
      title: "Estás seguro?",
      text: "No podrás revertir esto!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrar esto!"
    }).then(result => {
      if (result.value) {
        this.props.dispatch(deletePhone(phone_id));
      }
    });
  };
  componentWillUnmount() {
    this.setState({
      modalIsActive: false
    });
  }
  render() {
    const { phoneList, isLoading, isValidating } = this.props;

    const { modalIsActive } = this.state;
    if (isLoading) {
      return (
        <Segment attached id="listElements">
          <HeaderWithRightLinkButton elementDetails={phoneElements} />
          <Grid textAlign="center">
            <Loader />
          </Grid>
        </Segment>
      );
    }
    return (
      <Segment attached id="listElements">
        <HeaderWithRightLinkButton elementDetails={phoneElements} />
        {phoneList.length === 0 && (
          <Grid centered>
            <Grid.Row style={{ marginLeft: 20 }}>
              Tu lista de teléfonos está vacía
            </Grid.Row>
          </Grid>
        )}
        {phoneList.map(PhoneDetail => {
          const { sequence, phone_number, is_verified, phone_id } = PhoneDetail;

          return (
            <ListWithRightButtons
              key={sequence}
              value={phone_number}
              categoryValue={"CELULAR"}
              elementDetails={phoneElements}
              validateButtonIsActive={is_verified}
              showModal={() => this.showModal(phone_id)}
              deleteElement={() => this.deleteItem(phone_id)}
            />
          );
        })}
        <ModalSendMessage
          modalIsActive={modalIsActive || isValidating}
          closeModal={this.closeModal}
          modalIndicator={"mobile"}
          textModalInfo={phoneElements.textModalInfo}
          imageModal={phoneElements.imageModal}
          validateItem={this.validateItem}
          isValidating={isValidating}
        />
      </Segment>
    );
  }
}
const mapStateToProps = state => {
  const { phoneList, isLoading, isValidating } = state.phone;
  return {
    phoneList,
    isLoading,
    isValidating
  };
};
export default connect(mapStateToProps)(PhoneList);
