import React from "react";
import { Route, RouteComponentProps, RouteProps } from "react-router";

type PrivateRouteProps = RouteProps & {
  component: // eslint-disable-next-line
  React.ComponentType<RouteComponentProps<any>>;
  // eslint-disable-next-line
};

const PrivateRoute = ({
  component: RouteComponent,
  ...rest
}: PrivateRouteProps) => {
  return (
    <Route
      {...rest}
      render={(routeProps) => <RouteComponent {...routeProps} />}
    />
  );
};

export default PrivateRoute;
