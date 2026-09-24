import React from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router";
import Layout, {
  loader as layoutLoader,
  action as layoutAction,
} from "./Layout";
import LinkDetailsPage, {
  loader as linkDetailLoader,
  action as linkDetailAction,
} from "./user-components/LinkDetailsPage";
import HomePage, {
  loader as homeLoader,
  action as homeAction,
} from "./user-components/HomePage";
import "./style.css";
import Login, { action as loginAction } from "./user-components/Login";
import Register, { action as registerAction } from "./user-components/Register";
import { requireAuth } from "./user-components/user-api";
import Logout from "./user-components/Logout";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route>
        <Route path="/login" action={loginAction} element={<Login />} />
        <Route
          path="/register"
          action={registerAction}
          element={<Register />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/"
          loader={layoutLoader}
          action={layoutAction}
          element={<Layout />}
        >
          <Route
            index
            element={<HomePage />}
            loader={homeLoader}
            action={homeAction}
          />
          <Route
            path="/:id"
            action={linkDetailAction}
            loader={linkDetailLoader}
            element={<LinkDetailsPage />}
          />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
