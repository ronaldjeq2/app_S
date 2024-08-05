import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import {
    View, Image, Text, Dimensions, PixelRatio,
} from "react-native";

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
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT * 0.9,
        backgroundColor: colors.$blue,
    },
    containersecond: {
        marginTop: "1%",
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT * 0.87,
        backgroundColor: colors.$blue,
    },
    ContainercardType: {
        marginVertical: WINDOW_HEIGHT * 0.01,
        borderRadius: WINDOW_HEIGHT * 0.01,
        marginHorizontal: 20,
        backgroundColor: colors.$senatiWhite,
        width: WINDOW_WIDTH * 0.3,
        height: WINDOW_HEIGHT * 0.05,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    cardType: {
        color: colors.$senatiBlue,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: WINDOW_HEIGHT * 0.03,
        fontWeight: "bold",
    },
    sloganWrapper: {},
    slogan: {
        marginTop: 5,
        height: WINDOW_HEIGHT * 0.12,
        width: WINDOW_WIDTH * 0.6,
        resizeMode: "stretch",
        marginBottom: WINDOW_HEIGHT * 0.02,
        alignContent: "center",
        alignItems: "center",
        // resizeMode: Image.resizeMode.contain,
    },
    datos_trabajador: {
        fontFamily: "Gridnik-Bold",
        fontSize: WINDOW_HEIGHT * 0.035,
        color: "white",
        textAlign: "center",
    },
    job: {
        fontSize: WINDOW_HEIGHT * 0.025,
        color: "white",
        textAlign: "center",
        marginTop: WINDOW_HEIGHT * 0.004,
    },
    descriptionWork: {
        color: colors.$senatiWhite,
        marginLeft: 10,
        fontSize: WINDOW_HEIGHT * 0.02,
    },
    studentCardPhoto: {
        // resizeMode: Image.resizeMode.cover,
        // marginLeft: 10,
    },
    hourContainer: {
        height: 40,
        alignItems: "center",
        marginTop: -30,
    },
    logo: {
        alignItems: "center",
        height: WINDOW_HEIGHT * 0.06,
        width: WINDOW_WIDTH * 0.4,
        marginTop: WINDOW_HEIGHT * 0.01,
    },
    workerContainer: {
        marginTop: WINDOW_HEIGHT * 0.01,
        flexDirection: "row",
        height: WINDOW_HEIGHT * 0.25,
    },
    logoContainer: {
        alignSelf: "center",
        marginTop: 10,
        alignContent: "center",
        alignItems: "center",
    },
};

class WorkerCard extends PureComponent {
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
                <View style={ stylefotocheck.ContainercardType }>
                    <Text style={ [ stylefotocheck.cardType ] }>Trabajador</Text>
                </View>
                <View style={ [ stylefotocheck.sloganWrapper, { alignSelf: "center" } ] }>
                    <View style={ { alignItems: "center" } }>
                        <Image
                            source={ require( "../images/somos-senati.png" ) }
                            style={ stylefotocheck.slogan }
                        />
                    </View>

                    <Text style={ stylefotocheck.datos_trabajador }>
                        {" "}
                        {user.firstName}
                        {" "}
                        {user.middleName}
                    </Text>
                    <Text style={ stylefotocheck.datos_trabajador }>{user.lastName}</Text>
                    <Text style={ stylefotocheck.job }>{user.workerDetail.Cargo}</Text>
                </View>
                <View style={ stylefotocheck.workerContainer }>
                    {!user.hasPhoto || hasImageError ? (
                        <Image
                            source={ require( "../images/sinFoto.png" ) }
                            resizeMode="stretch"
                            style={ [
                                stylefotocheck.studentCardPhoto,
                                {
                                    marginLeft: 20,
                                    width: WINDOW_WIDTH * 0.4,
                                    height: WINDOW_HEIGHT * 0.25,
                                },
                            ] }
                        />
                    ) : (
                        <Image
                            source={ {
                                uri: `${ settings.baseUrl }/employee/${ user.id }/card/photo`,
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
                            onLoadEnd={ () => this.setState( { isImageLoading: false } ) }
                            resizeMode="stretch"
                            style={ [
                                stylefotocheck.studentCardPhoto,
                                {
                                    width: WINDOW_WIDTH * 0.4,
                                    height: WINDOW_HEIGHT * 0.25,
                                    marginLeft: 20,
                                },
                            ] }
                        />
                    )}
                    <View
                        style={ {
                            flex: 1,
                            marginLeft: 20,
                        } }
                    >
                        <Text style={ stylefotocheck.descriptionWork }>
                            {user.workerDetail.Zonal}
                        </Text>
                        <Text style={ stylefotocheck.descriptionWork }>{`ID: ${ user.id }`}</Text>
                        <Text style={ stylefotocheck.descriptionWork }>
                            {`${ user.docType }: ${ user.numDoc }`}
                        </Text>
                        <View style={ stylefotocheck.hourContainer }>
                            <Hourtext
                                fonsizeDate={ WINDOW_HEIGHT * 0.025 }
                                fontsizeHour={ WINDOW_HEIGHT * 0.05 }
                            />
                        </View>
                    </View>
                </View>
                <View style={ stylefotocheck.logoContainer }>
                    <Text
                        style={ {
                            color: colors.$senatiWhite,
                            fontSize: WINDOW_HEIGHT * 0.025,
                        } }
                    >
                        {user.workerDetail.Fecha_Cese !== ""
                            ? `Fecha de cese:  ${ user.workerDetail.Fecha_Cese }`
                            : ""}
                    </Text>

                    <Image
                        resizeMode="stretch"
                        style={ stylefotocheck.logo }
                        source={ require( "../images/senati-small-logo-horizontal.png" ) }
                    />
                </View>
            </View>
        );
    }
}

export default WorkerCard;
