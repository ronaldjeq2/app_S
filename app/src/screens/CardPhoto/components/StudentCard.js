import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import {
    View, Image, Text, Dimensions,
} from "react-native";
import { connect } from "react-redux";

import { colors } from "../../../config/styles";
import settings from "../../../config/settings";
import { Hourtext } from "../../../components/Hour";

// Passport aspect ratio 4 cm x 4 cm
const PHOTO_RATIO = 4 / 4;

const WINDOW_WIDTH = Dimensions.get( "window" ).width;
const WINDOW_HEIGHT = Dimensions.get( "window" ).height;
const ORIENTATION_PORTRAIT = WINDOW_HEIGHT > WINDOW_WIDTH;

const DEVICE_WIDTH = ORIENTATION_PORTRAIT ? WINDOW_WIDTH : WINDOW_HEIGHT;

const stylefotocheck = {
    container: {
        marginTop: "1%",
        width: "100%",
        height: WINDOW_HEIGHT * 0.6,
        flexDirection: "row",
        backgroundColor: colors.$blue,
    },
    containersecond: {
        marginTop: "1%",
        width: "100%",
        height: WINDOW_HEIGHT * 0.6,
        flexDirection: "row",
        backgroundColor: colors.$blue,
    },
    studentconatiner: {
        width: "70%",
        height: "100%",
        margin: 0,
    },
    imagestudentconatiner: {
        marginLeft: 25,
        marginVertical: 10,
        justifyContent: "space-between",
    },
    ContainercardType: {
        borderRadius: WINDOW_HEIGHT * 0.01,
        backgroundColor: colors.$senatiWhite,
        width: WINDOW_WIDTH * 0.3,
        height: WINDOW_HEIGHT * 0.05,
        justifyContent: "center",
        marginBottom: WINDOW_HEIGHT * 0.02,
    },
    cardType: {
        color: colors.$senatiBlue,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: WINDOW_HEIGHT * 0.03,
        fontWeight: "bold",
    },
    studentCardPhoto: {
        // resizeMode: Image.resizeMode.cover,
        // marginLeft: 10,
    },
    imageContainer: {
        height: WINDOW_HEIGHT * 0.3,
        width: WINDOW_WIDTH * 0.4,
    },
    studentCardData: {
        flex: 1,
        marginLeft: 10,
    },
    datos_estudiante: {
        fontFamily: "Gridnik-Bold",
        fontSize: WINDOW_HEIGHT * 0.03,
        color: "white",
    },
    datos_carrera: {
        fontSize: WINDOW_HEIGHT * 0.02,
        color: "white",
        fontFamily: "Gridnik-Bold",
    },
    logo: {
        height: WINDOW_HEIGHT * 0.06,
        width: WINDOW_WIDTH * 0.38,
        marginTop: WINDOW_HEIGHT * 0.03,
    },
    timeconatiner: {
        flex: 1,
        alignItems: "center",
    },

    sloganWrapper: {
        marginBottom: 10,
    },
    slogan: {
        marginTop: WINDOW_HEIGHT * 0.05,
        height: WINDOW_HEIGHT * 0.1,
        width: WINDOW_WIDTH * 0.38,
        marginRight: 10,
    },
    hourContainer: {
        height: 120,
        marginTop: 10,
        alignItems: "center",
    },
};

class StudentCard extends PureComponent {
    state = {
        isImageLoading: true,
        hasImageError: false,
    };

    static propTypes = {
        hasError: PropTypes.bool,
        user: PropTypes.object,
        token: PropTypes.string,
        connected: PropTypes.bool,
    };

    render() {
        const { isImageLoading, hasImageError } = this.state;

        const {
            user, token, connected, hasError,
        } = this.props;

        const photoHeight = DEVICE_WIDTH * 0.45 - 20;
        let photoWidth = 120;
        if ( user.hasPhoto ) {
            photoWidth = photoHeight * PHOTO_RATIO;
        }

        return (
            <View
                style={
                    connected && !hasError
                        ? stylefotocheck.container
                        : stylefotocheck.containersecond
                }
            >
                <View style={ stylefotocheck.studentconatiner }>
                    <View style={ { flex: 1, flexDirection: "row" } }>
                        <View
                            style={ [
                                stylefotocheck.imagestudentconatiner,
                                {
                                    width: user.hasPhoto ? photoWidth : null,
                                },
                            ] }
                        >
                            <View style={ stylefotocheck.ContainercardType }>
                                <Text style={ stylefotocheck.cardType }>Estudiante</Text>
                            </View>
                            <View style={ { flex: 1 } }>
                                <View style={ stylefotocheck.imageContainer }>
                                    {!user.hasPhoto || hasImageError ? (
                                        <Image
                                            source={ require( "../images/sinFoto.png" ) }
                                            resizeMode="stretch"
                                            style={ [
                                                stylefotocheck.studentCardPhoto,
                                                {
                                                    width: WINDOW_WIDTH * 0.4,
                                                    height: WINDOW_HEIGHT * 0.3,
                                                },
                                            ] }
                                        />
                                    ) : (
                                        <Image
                                            source={ {
                                                uri: `${ settings.baseUrl }/student/${
                                                    user.id
                                                }/card/photo`,
                                                cache: "force-cache",
                                                method: "GET",
                                                headers: {
                                                    "Content-Type": "image/png",
                                                    Authorization: `Bearer ${ token }`,
                                                },
                                            } }
                                            onError={ () => {
                                                this.setState( {
                                                    hasImageError: true,
                                                    isImageLoading: false,
                                                } );
                                            } }
                                            onLoadEnd={ () => this.setState( { isImageLoading: false } )
                                            }
                                            resizeMode="stretch"

                                            style={ [
                                                stylefotocheck.studentCardPhoto,
                                                {
                                                    width: WINDOW_WIDTH * 0.4,
                                                    height: WINDOW_HEIGHT * 0.3,
                                                },
                                            ] }
                                        />
                                    )}
                                </View>
                                <Image
                                    resizeMode="stretch"
                                    style={ stylefotocheck.logo }
                                    source={ require( "../images/senati-small-logo-horizontal.png" ) }
                                />
                            </View>
                        </View>
                        <View style={ [ stylefotocheck.studentCardData ] }>
                            <View
                                style={ {
                                    marginTop: WINDOW_HEIGHT * 0.08,
                                } }
                            />
                            <Text style={ stylefotocheck.datos_estudiante }>
                                {user.firstName}
                                {" "}
                                {user.middleName}
                            </Text>
                            <Text style={ stylefotocheck.datos_estudiante }>{user.lastName}</Text>
                            <Text style={ stylefotocheck.datos_carrera }>
                                {user.studentCard.career}
                            </Text>
                            <Text style={ stylefotocheck.datos_carrera }>
                                ID:
                                {user.id}
                            </Text>
                            <Text style={ stylefotocheck.datos_carrera }>
                                {user.docType}
                                {" : "}
                                {user.numDoc}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={ stylefotocheck.timeconatiner }>
                    <View style={ stylefotocheck.hourContainer }>
                        <Hourtext
                            fonsizeDate={ WINDOW_HEIGHT * 0.03 }
                            fontsizeHour={ WINDOW_HEIGHT * 0.05 }
                        />
                    </View>
                    <View style={ stylefotocheck.sloganWrapper }>
                        <Image
                            source={ require( "../images/SomosFuturo.png" ) }
                            resizeMode="stretch"
                            style={ [ stylefotocheck.slogan ] }
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default StudentCard;
