import React from "react";
import { Link, Outlet } from "react-router";
import Profile from "./user-components/Profile";

export default function Layout({ isLoggedIn, user }) {
  return (
    <>
      <header>
        {isLoggedIn ? <h2>Welcome {user.firstName}</h2> : <h2>ClipLink</h2>}

        {isLoggedIn ? (
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
