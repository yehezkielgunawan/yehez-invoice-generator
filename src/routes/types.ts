import { RouteProps } from "react-router";
import { RouteComponentProps } from "react-router-dom";

export type RouteType = RouteProps & {
  title: string;
  path: string | readonly string[];
  component: // eslint-disable-next-line
  React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
};
