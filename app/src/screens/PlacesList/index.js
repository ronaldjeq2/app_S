import React, { Component } from 'react';
import { Text, View, Dimensions, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import style from "./styles";
import { Loader } from "../../components";
import { placeSelected, placesListRequest } from "../../actions/places";
const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height)


class PlaceList extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        isLoading: PropTypes.bool,
        placesList: PropTypes.array,
        navigation: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.props.dispatch(placesListRequest())
    }
    state = {
        data: this.props.placesList,
        dataOri: this.props.placesList,
    };
    componentDidUpdate(prevProps) {

        if (prevProps.isLoading !== this.props.isLoading) {
            this.updatedList()
        }
    }
    updatedList = () => {
        this.setState({
            dataOri: this.props.placesList,
            data: this.props.placesList,
        });
    }
    filterData = (input) => {
        const { data, dataOri } = this.state;
        const keyWord = input.toLowerCase();

        let filteredData;

        let changed = false;

        if (!input) {
            changed = data.length !== dataOri.length;
            filteredData = dataOri;
        }
        else {
            filteredData = dataOri.filter((item) => {
                const keyString = item.descripcion.toLowerCase();
                if (keyString.indexOf(keyWord) !== -1) {
                    return true;
                }
            });

            let currentKeys = data.map(item => item.descripcion);
            let filteredKeys = filteredData.map(item => item.descripcion);

            currentKeys = currentKeys.sort().join("-");
            filteredKeys = filteredKeys.sort().join("-");
            changed = currentKeys !== filteredKeys;
        }

        if (changed) {
            this.setState({ data: filteredData });
        }
    };

    getMap = (item) => {
        const { dispatch, navigation } = this.props;
        const placeToSelected = {
            latitude: item.marker.latitude,
            longitude: item.marker.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
        dispatch(placeSelected(placeToSelected));
        navigation.navigate('MapsScreen');

    };


    render() {
        const { data, dataOri } = this.state;
        const { placesList, isLoading } = this.props;
        if (isLoading) {
            return <Loader />;
        }
        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={style.searchInputView}>
                    <Image source={require("./images/search.png")} style={style.inlineImg} />
                    <TextInput
                        style={style.textInput}
                        placeholder="Ingresa periodo, carrera o programa"
                        placeholderTextColor="#8492A6"
                        underlineColorAndroid="transparent"
                        onChangeText={this.filterData}
                    />
                </View>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => item.codigoSede}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                this.getMap(item);
                            }}
                        >
                            <View style={style.item}>
                                <View style={style.info}>
                                    <View style={style.container}>
                                        <Text style={style.title}>{item.descripcion}</Text>
                                        <Text style={style.subTitle}>{item.direccion}</Text>
                                    </View>
                                </View>
                                <Text style={style.textSee} >
                                    Ver en Mapa
                                </Text>
                                <Image
                                    source={require("./images/chevron-right.png")}
                                    style={style.arrow}
                                />
                            </View>
                        </TouchableOpacity>

                    )}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const { isLoading, placesList } = state.places;
    return {
        isLoading,
        placesList,
    };
};
export default connect(mapStateToProps)(PlaceList);
