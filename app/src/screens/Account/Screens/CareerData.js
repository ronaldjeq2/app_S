import React, { Component } from "react";
import PropTypes from "prop-types";
import {
     ScrollView
} from "react-native";
import { connect } from "react-redux";
import styles from "../styles";
import { Loader } from "../../../components";
import InfoCarreer from "./components/infoCareer";
import { Errortext } from "../../../components/Error";


class CareerData extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        userInfo: PropTypes.object,
    };

    constructor( props ) {
        super( props );

        this.state = {};
    }

    render() {
        const { userInfo } = this.props;
        if ( userInfo.isLoading && !userInfo.id ) {
            return <Loader />;
        }

        return (
            <ScrollView style={ styles.container }>
                <Errortext />
                <InfoCarreer
                    title="Información Vigente"
                    tipo="vigente"
                    item={ userInfo.careerDetail }
                />
                <InfoCarreer
                    title="Información Curriculum"
                    tipo="curriculum"
                    item={ userInfo.curriculumDetail }
                />
            </ScrollView>
        );
    }
}
const mapStateToProps = state => ( {
    userInfo: state.student,
    hasError: state.error.hasError,
} );
export default connect( mapStateToProps )( CareerData );
