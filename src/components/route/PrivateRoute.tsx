import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router";
import { useSigninCheck } from "reactfire";

type PrivateRouteProps = RouteProps & {
  component: // eslint-disable-next-line
  React.ComponentType<RouteComponentProps<any>>;
  // eslint-disable-next-line
};

const PrivateRoute = ({
  component: RouteComponent,
  ...rest
}: PrivateRouteProps) => {
  const { data: signInCheckResult } = useSigninCheck();
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        signInCheckResult?.signedIn ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
