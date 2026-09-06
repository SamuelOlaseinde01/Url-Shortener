import React from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router";
import Layout from "./Layout";
import LinkDetailsPage from "./LinkDetailsPage";
import HomePage, { action as homeAction } from "./HomePage";
import "./style.css";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} action={homeAction} />
        <Route path="/:id" element={<LinkDetailsPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}
