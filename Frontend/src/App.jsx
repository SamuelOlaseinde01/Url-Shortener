import React from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router";
import Layout from "./Layout";
import LinkDetailsPage from "./user-components/LinkDetailsPage";
import HomePage, { action as homeAction } from "./user-components/HomePage";
import "./style.css";
import Login from "./user-components/Login";
import Register from "./user-components/Register";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} action={homeAction} />
          <Route path="/:id" element={<LinkDetailsPage />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
