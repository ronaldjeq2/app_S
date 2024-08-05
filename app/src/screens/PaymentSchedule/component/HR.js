import React, { Component } from "react";
import { HR } from "../../../components";

const initialSpaces = [ 1, 2, 3, 4, 5, 6 ];

const HrPayment = () => {
    return initialSpaces.map( ( item, key ) => <HR key={ item } /> );
};

export default HrPayment;
