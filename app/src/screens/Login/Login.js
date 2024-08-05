import React, { Component } from "react";
import {
    View, Text, Image, StatusBar, TouchableWithoutFeedback, Keyboard
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginRequest } from "../../actions/session";
import { colors } from "../../config/styles";
import { Button } from "../../components/Buttons";
import { InputWithIcon } from "../../components/input";
import settings from "../../config/settings";
import styles from "./styles";
import Logo from "./Logo";
import { Errortext } from "../../components/Error";
const USERNAME_MAX_LENGTH = 9;
const PASSWORD_MAX_LENGTH = 15;
const PASSWORD_MIN_LENGTH = 6;

export class Login extends Component {

    static propTypes = {
        dispatch: PropTypes.func,
        isFetching: PropTypes.bool,
        hasError: PropTypes.bool,
        errorMessage: PropTypes.string,
        navigation: PropTypes.object,
        hasOtherError: PropTypes.bool,
        error_Message: PropTypes.string

    };

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            isDisabled: true,
            showPassword: false,
        };
        this.passwordInputRef = undefined;
    }

    handleButtonLogin = () => {
        const { dispatch } = this.props;
        const { username, password } = this.state;
        dispatch(loginRequest(username, password));
    };

    handleSeePlaces = () => {
        const { navigation } = this.props;
        navigation.navigate('PlacesList');
    };

    handleInputUsername = (username) => {
        const { password } = this.state;

        if (!username || !password || password.length < PASSWORD_MIN_LENGTH) {
            this.setState({ username, isDisabled: true });
        }
        else {
            this.setState({ username, isDisabled: false });
        }
    };

    handleInputPassword = (password) => {
        const { username } = this.state;

        if (!password || !username || password.length < PASSWORD_MIN_LENGTH) {
            this.setState({ password, isDisabled: true });
        }
        else {
            this.setState({ password, isDisabled: false });
        }
    };

    passwordInputFocus = () => {
        if (this.passwordInputRef) {
            this.passwordInputRef.focus();
        }
    };

    render() {
        const { errorMessage, hasError, isFetching, hasOtherError, error_Message } = this.props;
        const {
            username, password, isDisabled, showPassword,
        } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <StatusBar backgroundColor={colors.$blue} barStyle="light-content" />
                    <Logo />

                    {/* Image background */}
                    <Image
                        resizeMode="stretch"
                        style={styles.contentBackgroundImage}
                        source={require("./images/pattern.png")}
                    />

                    {hasError && (
                        <View style={styles.errorWrapper}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}
                    <Errortext lastUpdated="" />
                    {/* Content */}

                    <View style={styles.content}>
                        {/* username */}
                        <InputWithIcon
                            onChangeText={this.handleInputUsername}
                            defaultValue={username}
                            autoCorrect={false}
                            returnKeyType="next"
                            keyboardType="numeric"
                            keyboardAppearance="dark"
                            enablesReturnKeyAutomatically
                            disableFullscreenUI
                            maxLength={USERNAME_MAX_LENGTH}
                            imageIcon={require("./images/user.png")}
                            clearButtonMode="always"
                            editable={!isFetching}
                            onSubmitEditing={this.passwordInputFocus}
                            accessible
                            accessibilityLabel="username"
                        />
                        {/* password */}
                        <InputWithIcon
                            ref={(component) => {
                                this.passwordInputRef = component && component.textInputRef;
                            }}
                            onChangeText={this.handleInputPassword}
                            defaultValue={password}
                            returnKeyType="go"
                            keyboardAppearance="dark"
                            disableFullscreenUI
                            maxLength={PASSWORD_MAX_LENGTH}
                            imageIcon={require("./images/padlock.png")}
                            editable={!isFetching}
                            autoCapitalize="none"
                            onSubmitEditing={this.handleButtonLogin}
                            accessible
                            accessibilityLabel="password"
                            secureTextEntry={!showPassword}
                            autoCorrect={false}
                            rightButton={{
                                onPress: () => this.setState({ showPassword: !showPassword }),
                                icon: require("./images/show.png"),
                                active: showPassword,
                            }}
                        />
                        <Button
                            text="ENTRAR"
                            onPress={this.handleButtonLogin}
                            isDisabled={isDisabled}
                            isFetching={isFetching}
                        />
                        {/* <Button
                            text="VER SEDES"
                            onPress={this.handleSeePlaces}
                        /> */}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{`v${settings.appVersion}`}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


const mapStateToProps = (state) => {
    const { hasError, errorMessage, isFetching } = state.session;
    const hasOtherError = state.error.hasError;
    const error_Message = state.error.error_Message;

    return {
        hasError,
        errorMessage,
        isFetching,
        hasOtherError,
        error_Message
    };
};

export default connect(mapStateToProps)(Login);
