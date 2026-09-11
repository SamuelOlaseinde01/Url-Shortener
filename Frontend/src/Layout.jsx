import React from "react";
import { Link, Outlet, useLoaderData } from "react-router";
import Profile from "./user-components/Profile";
import { getOptionalUser } from "./user-components/user-api";

export async function loader() {
  const user = await getOptionalUser();
  return user;
}

export default function Layout() {
  const user = useLoaderData();
  console.log(user);
  return (
    <>
      <header>
        {user ? (
          <h2 style={{ textTransform: "capitalize" }}>
            Welcome, {user.firstName}
          </h2>
        ) : (
          <h2>ClipLink</h2>
        )}

        {user ? (
          <nav>
            <Profile />
          </nav>
        ) : (
          <nav className="nav-unregistered">
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
          </nav>
        )}
      </header>
      <Outlet />
    </>
  );
}
