import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View,
    StatusBar,
    AsyncStorage,
    Platform,
} from "react-native";

import { connect } from "react-redux";

//import { Crashlytics, Answers } from "react-native-fabric";
import firebase from 'react-native-firebase';

import { Button } from "../../components/Buttons";
import { walkWasShownAction } from "../../actions/session";
import SwiperFlatList from 'react-native-swiper-flatlist';
import Walkinfo from "./components/Walkinfo";
import { colors } from "../../config/styles";
import settings from "../../config/settings";

import style from "./styles";

const SESSION_WALK = "walkVersion";

const walkInformation = [
    {
        walk: 0,
        imageSource: require("./images/paymentSchedule.png"),
        tittleSteep: "Cronograma de Pagos",
        descriptionSteep:
            "Revisa el estado de tus cuotas y tu cronograma de pagos del periodo actual y otros periodos culminados.",
        isFinal:false
    },

    {
        walk: 1,
        imageSource: require("./images/offLine.png"),
        tittleSteep: "Modo Off Line",
        descriptionSteep:
            "Mantén tu información siempre a la mano con la función Off line. \n Todos tus datos estarán sincronizados en tu dispositivo",
        isFinal:false
    },

    {
        walk: 2,
        imageSource: require("./images/Fotocheck.png"),
        tittleSteep: "Fotocheck",
        descriptionSteep: "Se ha ampliado el fotocheck para todos los programas",
        isFinal:false
    },

    {
        walk: 3,
        imageSource: require("./images/design-Improvements.png"),
        tittleSteep: "Mejoras de diseño",
        descriptionSteep:
            "Hemos realizado mejoras en el dieseño y la arquitectura de la aplicación, para una mejor optimización de la aplicación",
        isFinal:true
    },

];

class WalkThough extends Component {
    static propTypes = {
        navigation: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.swiperRef = null;
    }

    componentDidMount() {
     //   Answers.logContentView("WalkThough", "screen");
    }

    handleNextSlideButton = () => {
            this.swiperRef.scrollToIndex({index:this.swiperRef.getCurrentIndex()+1,animated:true})
    };

    handleEndWalk = () => {
        const { navigation,dispatch } = this.props;
        AsyncStorage.setItem(SESSION_WALK, settings.appVersion, (error) => {
            if (error) {
                firebase.crashlytics().recordCustomError(
                    'Custom Error',
                    'Oh No!',
                    [
                        {
                            className: 'WalkThough',
                            fileName: 'WalkThough.js',
                            functionName: 'handleEndWalk',
                            lineNumber: 84
                        }
                    ]
                );
/*                 if (Platform.OS === "ios") {
                  //  Crashlytics.recordError(`${error}`);
                }
                else {
                  //  Crashlytics.logException(`${error}`);
                } */
            }
            navigation.navigate("App");
        });
        dispatch( walkWasShownAction() );
    };

    render() {

        return (
            <View style={style.container}>
                <StatusBar backgroundColor={colors.$blue} barStyle="light-content" />
                <SwiperFlatList
                    index={0}
                    showPagination
                    paginationActiveColor="#274187"
                    paginationDefaultColor="#C0CCDA"
                    onChangeIndex={this.ChangeIndex}
                    ref={(ref) => {
                        this.swiperRef = ref;
                    }}
                    renderAll={true}
                    paginationStyle={{marginBottom:'10%'}}
                >
                    {walkInformation.map(index => (
                            <Walkinfo
                                key={index.walk}
                                tittleSteep={index.tittleSteep}
                                descriptionSteep={index.descriptionSteep}
                                step={index.walk}
                                icon={index.imageSource}
                                isFinalWalk={index.isFinal}
                                handleEndWalk={this.handleEndWalk}
                                handleNextSlideButton={this.handleNextSlideButton}
                            />
                        ))}
                </SwiperFlatList>
            </View>
        );
    }
}



export default connect()(WalkThough);
