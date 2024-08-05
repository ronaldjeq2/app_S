import React, { Component } from "react";
import {
    Text, View, Image, TextInput, ScrollView, Platform,
} from "react-native";

import { connect } from "react-redux";

import PropTypes from "prop-types";
import HeaderWithRightButton from "../../components/Header/HeaderWithRightButton";
import { colors } from "../../config/styles";
import NotificationInfo from "./components/NotificationInfo";

import { getNotificationList } from "../../actions/notification";

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
};

class Notification extends Component {
    static propTypes = {
        hasStudentCard: PropTypes.bool,
        hasWorkCard: PropTypes.bool,
        navigation: PropTypes.object,
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getNotificationList());
    }

    handleActivateConfigurations = () => {
        const { navigation } = this.props;
        navigation.navigate("NotificationConfiguration");
    };

    handleGoBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    linkScreen = (screen) => {
        const { navigation } = this.props;
        navigation.navigate(screen);
    };

    render() {
        const { notificationList } = this.props;
        return (
            <View style={styles.container}>
                <HeaderWithRightButton
                    onLeftButtonPress={() => this.handleGoBack()}
                    // onRightButtonPress={() => this.handleActivateConfigurations()}
                    // imageIcon={require("./images/settings.png")}
                    headerTittle="NOTIFICACIONES"
                />
                {notificationList
                    && notificationList.length > 0 ? (
                        <ScrollView style={{ marginBottom: 55 }}>
                            {notificationList.map((notification, key) => (
                                <NotificationInfo
                                    viewScreen={() => this.linkScreen(item.screen)}
                                    key={key}
                                    notification={notification}
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={{ flex: 1, backgroundColor: "white", marginVertical: '60%', alignItems: 'center' }}>
                            <Text style={styles.emptyText}>Tu lista de notificaciones está vacía</Text>
                        </View>
                    )}
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    const { store } = state.notification;
    return {
        notificationList: store,
    };
};
export default connect(mapStateToProps)(Notification);


