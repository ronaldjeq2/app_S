import React, { Component } from "react";
import PropTypes from "prop-types";
import { ScrollView, View } from "react-native";
import { connect } from "react-redux";

//import { Crashlytics, Answers } from "react-native-fabric";
import firebase from 'react-native-firebase';
import { Loader } from "../../../components";
import { Segment, SegmentItem } from "../../../components/Segment";

import Credential from "./components/credentials";
import { accountRequestInfoAction } from "../../../actions/student";
import { Errortext } from "../../../components/Error";

class PersonalDate extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        userInfo: PropTypes.object,
    };

    constructor( props ) {
        super( props );

        this.state = {};
        this.props.dispatch( accountRequestInfoAction() );

    }

    componentDidMount() {
        firebase.crashlytics().log("PersonalData Screen fue montado")
      //  Crashlytics.log( "PersonalDate fue montado" );
    }

    render() {
        const { userInfo } = this.props;

        if ( userInfo.isLoading && !userInfo.id ) {
            return <Loader />;
        }

        return (
            <ScrollView style={ { flex: 1, backgroundColor: "white" } }>
                <Errortext lastUpdated={ userInfo.lastUpdated } />
                <Credential data={ userInfo } />
                <Segment
                    title="Correos"
                    items={ userInfo.emailList }
                    emptyMessage="No tienes correos registrados"
                >
                    <View>
                        {userInfo.emailList.map( item => (
                            <SegmentItem
                                key={ item.key }
                                text={ item.address }
                                label={ item.preferred ? "Principal" : null }
                            />
                        ) )}
                    </View>
                </Segment>
                <Segment
                    title="Teléfonos"
                    items={ userInfo.phoneList }
                    emptyMessage="No tienes teléfonos registrados"
                >
                    <View>
                        {userInfo.phoneList.map( item => (
                            <SegmentItem key={ item.key } text={ item.number } subtitle={ item.type } />
                        ) )}
                    </View>
                </Segment>
                <Segment
                    title="Direcciones"
                    items={ userInfo.addressList }
                    emptyMessage="No tienes direcciones registradas"
                >
                    <View>
                        {userInfo.addressList.map( item => (
                            <SegmentItem
                                key={ item.key }
                                text={ `${ item.address }${ item.city ? ` | ${ item.city }` : "" }` }
                                subtitle={ item.type }
                                label={ item.preferred ? "Principal" : null }
                            />
                        ) )}
                    </View>
                </Segment>
            </ScrollView>
        );
    }
}
const mapStateToProps = state => ( {
    userInfo: state.student,
    hasError: state.error.hasError,
} );
export default connect( mapStateToProps )( PersonalDate );
