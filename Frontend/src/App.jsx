import React from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router";
import Layout, { loader as layoutLoader } from "./Layout";
import LinkDetailsPage from "./user-components/LinkDetailsPage";
import HomePage, { action as homeAction } from "./user-components/HomePage";
import "./style.css";
import Login, { action as loginAction } from "./user-components/Login";
import Register, { action as registerAction } from "./user-components/Register";
import { requireAuth } from "./user-components/user-api";

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
        <Route />
        <Route path="/" loader={layoutLoader} element={<Layout />}>
          <Route index element={<HomePage />} action={homeAction} />
          <Route
            path="/:id"
            loader={requireAuth}
            element={<LinkDetailsPage />}
          />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
