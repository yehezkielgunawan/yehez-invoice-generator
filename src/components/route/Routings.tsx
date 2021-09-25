import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { privateRoutes, restrictedRoutes } from "routes";

import PrivateRoute from "./PrivateRoute";

const Routings = () => {
  return (
    <Switch>
      {restrictedRoutes.map((restrictedRoute) => (
        <Route
          path={restrictedRoute.path}
          component={restrictedRoute.component}
          key={restrictedRoute.title}
          exact
        />
      ))}
      {privateRoutes.map((privateRoute) => (
        <PrivateRoute
          path={privateRoute.path}
          component={privateRoute.component}
          key={privateRoute.title}
          exact
        />
      ))}
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};

export default Routings;
