import { lazy } from "react";

import { RouteType } from "./types";

/** restricted pages / routes lazy imports */
const Login = lazy(() => import("components/auth/login"));

/** private pages / routes lazy imports */

const Admin = lazy(() => import("components/admin"));
const Seller = lazy(() => import("components/seller"));
const Buyer = lazy(() => import("components/buyer"));

export const restrictedRoutes: Array<RouteType> = [
  {
    title: "Masuk",
    path: "/login",
    component: Login,
  },
];

export const privateRoutes: Array<RouteType> = [
  {
    title: "Admin",
    path: "/admin",
    component: Admin,
  },
  {
    title: "Seller",
    path: "/seller",
    component: Seller,
  },
  {
    title: "Buyer",
    path: "/buyer",
    component: Buyer,
  },
];
