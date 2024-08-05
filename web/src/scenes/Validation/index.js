import React from "react";
import { Switch, Route } from "react-router-dom";
import List from "./scenes/List";
import AddEmail from "./scenes/Email/AddEmail";
import AddPhone from "./scenes/Phone/AddPhone";
import VerifyEmail from "./scenes/Email/VerifyEmail";
import VerifyPhone from "./scenes/Phone/VerifyPhone";
import Error404 from "./Error404";
const Validation = ({ match }) => {
  // const { tittle, pathFragment, linkFragment } = typeElement;
  return (
    <Switch>
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/`}
        component={() => <List />}
      />

      <Route
        exact
        path={`${process.env.PUBLIC_URL}/telefono/agregar`}
        component={() => <AddPhone />}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/telefono/verificar`}
        component={() => <VerifyPhone />}
      />

      <Route
        exact
        path={`${process.env.PUBLIC_URL}/correo/agregar`}
        component={() => <AddEmail />}
      />
      <Route
        exact
        path={`${process.env.PUBLIC_URL}/correo/verificar`}
        component={() => <VerifyEmail />}
      />
      <Route component={() => <Error404 />} />
    </Switch>
  );
};

export default Validation;
