import React from "react";
import { Link, Outlet, useLoaderData, redirect, Form } from "react-router";
import { getOptionalUser, logoutUser } from "./user-components/user-api";
import { LogOut } from "lucide-react";

export async function action() {
  await logoutUser();
  return redirect("/logout");
}

export async function loader() {
  const user = await getOptionalUser();
  return user;
}

export default function Layout() {
  const user = useLoaderData();

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
            <Form method="post">
              <button
                type="submit"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  color: "inherit",
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </Form>
          </nav>
        ) : (
          <nav className="nav-unregistered">
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
          </nav>
        )}
      </header>
      <Outlet context={user} />
    </>
  );
}
