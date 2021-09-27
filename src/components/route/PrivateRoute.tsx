import { Spinner } from "@chakra-ui/spinner";
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
  const { status, data: signInCheckResult } = useSigninCheck();

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        signInCheckResult?.signedIn === true &&
        signInCheckResult?.user.email?.includes(
          String(rest.path).replace("/", ""),
        ) ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
