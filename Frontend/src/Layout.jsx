import React from "react";
import { Outlet } from "react-router";

export default function Layout({ isLoggedIn, user }) {
  return (
    <>
      <header>
        {/* Displays a welcome message depending on the log in state of the user */}
        {isLoggedIn ? <h2>Welcome {user.firstName}</h2> : <h2>UrlShorten</h2>}
        {/* Displays a Login and Register link or the user profile based on login state of the user*/}
        {isLoggedIn ? (
          <nav>
            <Profile />
          </nav>
        ) : (
          <nav>
            <a>Register</a>
            <a>Login</a>
          </nav>
        )}
      </header>
      <Outlet />
    </>
  );
}
