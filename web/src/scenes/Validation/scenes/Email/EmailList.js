import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Segment, Grid } from "semantic-ui-react";
import { sendEmailCode, deleteEmail } from "../../../../actions/email";
import HeaderWithRightLinkButton from "../../components/HeaderWithRightlinkButton";
import ListWithRightButtons from "../../components/ListWithRightButtons";
import { ModalSendMessage } from "../../../../components/Modal";
import { getListEmail } from "../../../../actions/email";
import Loader from "../../../../components/Loader/loader";
import Swal from "sweetalert2";

const emailElements = {
  tittle: "CORREOS",
  pathIndicator: "correo",
  linkTextFragment: "correo",
  modalType: "email",
  textModalInfo: "correo electrónico a la cuenta ingresada",
  imageModal: "email"
};
class EmailList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    emailList: PropTypes.array,
    isLoading: PropTypes.bool
  };
  state = {
    modalIsActive: false,
    valueToVerify: null
  };
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(getListEmail());
  }

  showModal = email_id => {
    this.setState({
      modalIsActive: true,
      valueToVerify: email_id
    });
  };
  closeModal = () => {
    this.setState({
      modalIsActive: false
    });
  };
  validateItem = () => {
    const { emailList } = this.props;

    const { valueToVerify } = this.state;
    const emailInfoResult = emailList.find(
      emailInfo => emailInfo.email_id === valueToVerify
    );
    this.setState(
      {
        modalIsActive: false
      },
      () => this.props.dispatch(sendEmailCode(emailInfoResult))
    );

    /*     Swal.fire({
      type: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: "<a href>Why do I have this issue?</a>"
    }); */
  };

  deleteItem = email_id => {
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
        this.props.dispatch(deleteEmail(email_id));
      }
    });
  };

  componentWillUnmount() {
    this.setState({
      modalIsActive: false
    });
  }
  render() {
    const { emailList, isLoading, isValidating } = this.props;
    const { modalIsActive } = this.state;

    if (isLoading || emailList.length < 0) {
      return (
        <Segment attached id="listElements">
          <HeaderWithRightLinkButton elementDetails={emailElements} />
          <Grid textAlign="center">
            <Loader />
          </Grid>
        </Segment>
      );
    }
    return (
      <Segment attached id="listElements">
        <HeaderWithRightLinkButton elementDetails={emailElements} />
        {emailList.length === 0 && (
          <Grid centered>
            <Grid.Row style={{ marginLeft: 20 }}>
              Tu lista de correos está vacía
            </Grid.Row>
          </Grid>
        )}
        {emailList.map((emailDetail, key) => {
          const {
            email_type_description,
            email_address,
            is_verified,
            email_id
          } = emailDetail;
          return (
            <ListWithRightButtons
              key={key}
              value={email_address}
              categoryValue={email_type_description}
              elementDetails={emailElements}
              validateButtonIsActive={is_verified}
              showModal={() => this.showModal(email_id)}
              deleteElement={() => this.deleteItem(email_id)}
            />
          );
        })}
        <ModalSendMessage
          modalIsActive={modalIsActive || isValidating}
          closeModal={this.closeModal}
          modalIndicator={"email"}
          textModalInfo={emailElements.textModalInfo}
          imageModal={emailElements.imageModal}
          validateItem={this.validateItem}
          isValidating={isValidating}
        />
      </Segment>
    );
  }
}
const mapStateToProps = state => {
  const { emailList, isLoading, isValidating } = state.email;

  return {
    emailList,
    isLoading,
    isValidating
  };
};
export default connect(mapStateToProps)(EmailList);
