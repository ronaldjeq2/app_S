import React, { Component } from "react";
import {
    View, Text, FlatList, TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import { newsListRequest } from "../../actions/news";
import NewsListViewItem from "./NewsListViewItem";

import { Errortext } from "../../components/Error";
import Indicator from "./components/Indicator";
import style from "./styles";

class News extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        isLoaded: PropTypes.bool,
        newsList: PropTypes.array,
    };

    constructor( props ) {
        super( props );
        this.state = {
            dataSource:[],
            nextPage: 0,
            listData: [],
            LoadingNews: true,
        };

    }

    componentDidMount() {
        this.loadMore();
    }

    componentDidUpdate( prevProps ) {

        if ( prevProps.newsList !== this.props.newsList ) {
            const listData = this.state.listData.concat( this.props.newsList );
            const nextPage = this.state.nextPage + 1;
            this.updatedList(listData,nextPage)
        }
    }

    updatedList = (listData,nextPage) => {
        this.setState( {
            listData,
            dataSource:  listData ,
            nextPage,
            LoadingNews: false,
        } );
    }

    loadMore = () => {
        this.setState( { LoadingNews: true } );
        this.fetchData();
    };

    fetchData() {
        const data = this.props;
        const url = this.state.nextPage;
        const typeRequest = "LIST";
        this.props.dispatch( newsListRequest( url, typeRequest ) );
    }

    footerButton() {
        if ( this.state.LoadingNews ) {
            return <Indicator />;
        }
        return (
            <TouchableOpacity style={ style.footerButton } onPress={ this.loadMore }>
                <Text style={ style.footerText }>Cargar mas</Text>
            </TouchableOpacity>
        );
    }

    loading() {
        return <Indicator />;
    }

    onNewsItemClick = ( data ) => {
        const title = fnsFormat( data.date, "DD [de] MMM [de] YYYY", {
            locale: fnsESLocale,
        } );

        this.props.navigation.navigate( "NewsDetails", {
            data,
            title,
        } );
    };


    render() {
        const { isLoaded } = this.props;
        if ( !isLoaded) {
            return <Indicator />;
        }
        return (
            <View style={ { flex: 1, backgroundColor: "white" } }>
                <Errortext lastUpdated="" />
                <FlatList
                    style={ style.containerNews }
                    data={ this.state.dataSource }
                    renderHeader={ () => <Text style={ styles.header }>Noticias</Text> }
                    renderItem={ ({item}) => (
                        <NewsListViewItem
                            data={ item }
                            key={ item.imageUri }
                            onPress={ () => this.onNewsItemClick( item ) }
                        />
                    ) }
                    ListFooterComponent={ () => <View style={ style.footerNews }>{this.footerButton()}</View> }
                />
            </View>
        );
    }
}

const mapStateToProps = ( state ) => {
    const isLoaded = state.news.isLoaded;
    const newsList = state.news.newsList;

    return {
        isLoaded,
        newsList,
    };
};
export default connect( mapStateToProps )( News );
