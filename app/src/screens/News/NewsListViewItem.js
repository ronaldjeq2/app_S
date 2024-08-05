import React from "react";

import {
    View, Image, Text, TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import fnsFormat from "date-fns/format";
import fnsESLocale from "date-fns/locale/es";
import style from "./styles";


const NewsListViewItem = ( { data,onPress} ) => {

    const thumbnaillUri = `https://app.senati.edu.pe/api/imageproxy/cx140,cw140/${
        data.thumbnail.split( "?" )[ 0 ]
    }`;
    
    return (
        <TouchableOpacity onPress={ onPress }>
            <View style={ style.itemList }>
                <Image style={ style.itemImage } source={ { uri: thumbnaillUri } } />

                <View style={ style.itemDescription }>
                    <Text style={ style.date }>
                        {fnsFormat( data.date, "MM/DD/YYYY ", {
                            locale: fnsESLocale,
                        } )}
                    </Text>

                    <Text
                        style={ style.itemDescriptionTitle }
                        ellipsizeMode="tail"
                        numberOfLines={ 4 }
                    >
                        {data.title}
                    </Text>

                    <Text
                        style={ style.itemDescriptionShort }
                        ellipsizeMode="tail"
                        numberOfLines={ 4 }
                    >
                        {data.shortDesc}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

NewsListViewItem.propTypes = {
    data: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default NewsListViewItem;
