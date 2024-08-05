import React, { Component } from "react";
import { connect } from "react-redux";

import {
    View,
    Image,
    Text,
    ScrollView,
} from "react-native";

import HTMLView from "react-native-htmlview";
import Dimensions from "Dimensions";
import firebase from 'react-native-firebase';
//import {  Answers } from "react-native-fabric"; // Get Crashlytics component
import PropTypes from "prop-types";
import { newsListRequest } from "../../actions/news";

import style from "./styles";
import Indicator from "./components/Indicator";

const DEVICE_WIDTH = Dimensions.get( "window" ).width;
const DEVICE_HEIGHT = Dimensions.get( "window" ).height;

class NewsItemView extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        detailNew: PropTypes.object,
        isDetailLoaded: PropTypes.bool,
    };

    constructor( props ) {
        super( props );

        this.state = {
            bgWith: DEVICE_WIDTH,
            bgHeight: 200,
            bgUri: "",
        };
    }

    componentDidMount() {
        firebase.analytics().setCurrentScreen("news_detail", "noticias")
      //  Answers.logContentView( "news_detail", "noticias" );

        this.fetchData();
    }

    fetchData() {
        const { state } = this.props.navigation;
        const { data } = state.params;
        const typeRequest = "DETAIL";
        url = data.href;
        this.props.dispatch( newsListRequest( url, typeRequest ) );
    }

    _onLayout = ( event ) => {
        const { detailNew } = this.props;
        if ( detailNew.objBgImage ) {
            const aspectRatio = detailNew.objBgImage.height / detailNew.objBgImage.width;

            const bgWith = event.nativeEvent.layout.width - 30;
            const bgHeight = ( event.nativeEvent.layout.width - 30 ) * aspectRatio;

            this.setState( { bgHeight, bgWith } );
        }
    };

    render() {
        const { detailNew, isDetailLoaded } = this.props;
        if ( !isDetailLoaded ) {
            return <Indicator />;
        }

        let richText = detailNew.richText;
        richText = richText.replace( "\n", "" );

        const bgWith = this.state.bgWith;
        const bgHeight = this.state.bgHeight;
        const bgUri = `https://app.senati.edu.pe/api/imageproxy/${ detailNew.bgImage }`;

        return (
            <ScrollView style={ style.container } onLayout={ this._onLayout }>
                <Image
                    style={ { width: bgWith, height: bgHeight } }
                    source={ { uri: bgUri } }
                    resizeMode="contain"
                />
                <Text style={ style.h2 }>
                    {detailNew.title_white}
                    {" "}
                    {detailNew.title_color}
                </Text>

                <Text style={ style.h3 }>{detailNew.headResume}</Text>

                <View style={ style.item }>
                    <HTMLView value={ richText } stylesheet={ style } onLinkPress={ url => null } />
                </View>
                <View style={ style.gallery }>
                    {detailNew.objGallery.map( ( image, index ) => (
                        <Image
                            key={ image.url }
                            source={ {
                                uri: `https://app.senati.edu.pe/api/imageproxy/${ image.url }`,
                            } }
                            resizeMode="cover"
                            style={ [
                                style.imageGallery,
                                { height: ( DEVICE_WIDTH * image.height ) / image.width },
                            ] }
                        />
                    ) )}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = ( state ) => {
    const detailNew = state.news.detailNew;
    const isDetailLoaded = state.news.isDetailLoaded;

    return {
        detailNew,
        isDetailLoaded,
    };
};
export default connect( mapStateToProps )( NewsItemView );
