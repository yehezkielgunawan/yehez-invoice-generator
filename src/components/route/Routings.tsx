import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { useSigninCheck } from "reactfire";
import { privateRoutes, restrictedRoutes } from "routes";

import PrivateRoute from "./PrivateRoute";

const Routings = () => {
  const { data: signInCheckResult } = useSigninCheck();
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
        {signInCheckResult?.signedIn ? (
          signInCheckResult?.user.email?.includes("admin") ? (
            <Redirect to="/admin" />
          ) : signInCheckResult?.user.email?.includes("seller") ? (
            <Redirect to="/seller" />
          ) : (
            <Redirect to="/buyer" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
    </Switch>
  );
};

export default Routings;
