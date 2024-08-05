import React from "react";
import { ActivityIndicator } from "react-native";

const Indicator = ( /* {  tintColor, title } */ ) => (
    <ActivityIndicator
        size="small"
        color="#274188"
        style={ { flex: 1, justifyContent: "center", alignItems: "center" } }
    />
);

export default Indicator;
