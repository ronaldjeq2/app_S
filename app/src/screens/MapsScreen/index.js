import React, { Component } from 'react';
import { Text, View, Dimensions, ScrollView, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { placeSelected } from "../../actions/places";

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height)


class MapScreen extends Component {
    static propTypes = {
        placeSelected: PropTypes.object,
        placesList: PropTypes.array,
        dispatch: PropTypes.func,
    };
    constructor(props) {
        super(props);
    }
    ChangeMarker = (marker) => {
        const { dispatch, navigation } = this.props;
        const placeToSelected = {
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
        dispatch(placeSelected(placeToSelected));
    }
    render() {
        const { placesList, placeSelected } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView
                    style={StyleSheet.absoluteFill}
                    contentContainerStyle={styles.scrollview}
                >
                    <MapView
                        provider={this.props.provider}
                        style={styles.map}
                        scrollEnabled={true}
                        zoomEnabled={true}
                        pitchEnabled={true}
                        rotateEnabled={true}
                        initialRegion={placeSelected}
                        region={placeSelected}
                        ref="map"
                    >
                        {placesList.map(info => {
                            return <Marker
                                key={info.codigoSede}
                                title={info.descripcion}
                                description={info.direccion}
                                coordinate={info.marker}
                                onPress={() => this.ChangeMarker(info.marker)}
                            />
                        }

                        )}
                    </MapView>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: height,
        width: width,
    },
    scrollview: {
        alignItems: 'center',
    },
    map: {
        height: height,
        width: width,
    },
});

const mapStateToProps = (state) => {
    const { placesList, placeSelected } = state.places;
    return {
        placesList,
        placeSelected,
    };
};
export default connect(mapStateToProps)(MapScreen);
