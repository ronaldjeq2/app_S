import React, { Component } from "react";
import {
    View, Image, Text, ScrollView, Switch, TouchableOpacity,
} from "react-native";

import { connect } from "react-redux";

import PropTypes from "prop-types";
import { HR } from "../../components";
import { colors, THEME } from "../../config/styles";
import {
    changeStatusNotification,
    enableAllNotifications,
    disableAllNotifications,
} from "../../actions/notification";

const style = {
    container: {
        flex: 1,
        backgroundColor: "#FFFF",
    },
    notificationActivator: {
        flexDirection: "row",
        marginLeft: 50,
        height: 50,
        alignContent: "center",
        alignItems: "center",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 3,
        height: 48,
        // backgroundColor: "yellow",
    },
    optionLabel: {
        flex: 1,
        textAlignVertical: "center",
        fontSize: 16,
    },
    optionList: {
        marginLeft: 50,
        marginRight: 10,
    },
    imageContainer: {
        marginLeft: 20,
        width: 40,
        alignItems: "center",
    },
    subTextPrincipal: { color: colors.$lighterBlue, fontSize: 10, fontWeight: "bold" },
};
const listPermission = ["general", "notes", "certificates", "payments", "events"];
class NotificationConfiguration extends Component {
    static propTypes = {
        notificationList: PropTypes.object,
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        allNotificationIsActive: PropTypes.bool,
        changeStatusNotificationIsFinished: PropTypes.bool, // don't touch with this variable the screen change values
    };

    handleGoBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    linkScreen = (screen) => {
        const { navigation } = this.props;
        navigation.navigate(screen);
    };

    handleChangeNotification = (notificationInfo) => {
        const { dispatch } = this.props;
        dispatch(changeStatusNotification(notificationInfo));
    };

    handleChangeAllNotification = () => {
        const { dispatch, allNotificationIsActive } = this.props;
        if (allNotificationIsActive) {
            dispatch(disableAllNotifications());
        }
        else {
            dispatch(enableAllNotifications());
        }
    };

    render() {
        const { notificationList, allNotificationIsActive } = this.props;
        return (
            <ScrollView style={style.container}>
                <View style={style.notificationActivator}>
                    <Text>Activar notificaciones</Text>
                    <TouchableOpacity
                        style={style.imageContainer}
                        onPress={() => this.handleChangeAllNotification()}
                    >
                        {!allNotificationIsActive ? (
                            <Image
                                resizeMode="contain"
                                source={require("./images/notification_inactive.png")}
                                style={{ height: 25 }}
                            />
                        ) : (
                                <Image
                                    resizeMode="contain"
                                    source={require("./images/notification_active.png")}
                                    style={{ height: 25, tintColor: colors.$lightBlue }}
                                />
                            )}
                    </TouchableOpacity>
                </View>
                <HR />
                <View style={{ marginLeft: 50, marginVertical: 20 }}>
                    <Text style={style.subTextPrincipal}>Tipos de notificaciones</Text>
                </View>
                {listPermission.map((item, key) => (
                    <View key={key} style={style.optionList}>
                        <TouchableOpacity
                            style={style.option}
                            activeOpacity={1}
                            onPress={() => this.handleChangeNotification(item)}
                        >
                            <Text style={style.optionLabel}>{notificationList[item].name}</Text>
                            <Switch
                                value={notificationList[item].isActive}
                                onValueChange={() => {
                                    this.handleChangeNotification(item);
                                }}
                                thumbColor={
                                    notificationList[item].isActive
                                        ? THEME.controlSwitchActiveColor
                                        : THEME.controlSwitchInactiveColor
                                }
                                trackColor={colors.$lighterBlue}
                            />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        );
    }
}
const mapStateToProps = (state) => {
    const {
        notificationList,
        changeStatusNotificationIsFinished,
        allNotificationIsActive,
    } = state.notification;
    return {
        notificationList,
        allNotificationIsActive,
        changeStatusNotificationIsFinished,
    };
};
export default connect(mapStateToProps)(NotificationConfiguration);
