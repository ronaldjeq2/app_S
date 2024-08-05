import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, TouchableHighlight, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import { BackButton } from "../../../components/Buttons";
import styles from "../../Sinfo/styles";
import { colors } from "../../../config/styles";

class HeaderCourseCourrent extends PureComponent {
    static propTypes = {
        navigation: PropTypes.object,
    };

    render() {
        const { funct } = this.props;
        return (
            <View>
                <TouchableHighlight onPress={ funct } style={ [ styles.headerButtons ] }>
                    <Image
                        resizeMode="contain"
                        source={ require( "../images/schedule.png" ) }
                        style={ {
                            height: 27,
                            tintColor: colors.$senatiWhite,
                        } }
                    />
                </TouchableHighlight>
            </View>
        );
    }
}
export default HeaderCourseCourrent;
