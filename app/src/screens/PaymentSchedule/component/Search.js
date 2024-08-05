import React from "react";
import { View, Image } from "react-native";
import { colors } from "../../../config/styles";

const Search = ( /* {  tintColor, title } */ ) => (
    <View>
        <Image
            resizeMode="contain"
            source={ require( "../images/searchSchedule.png" ) }
            style={ {
                height: 27,
                tintColor: colors.$senatiWhite,
            } }
        />
    </View>
);

export default Search;
