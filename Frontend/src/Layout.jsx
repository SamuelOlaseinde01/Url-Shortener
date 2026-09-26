import React from "react";
import { Link, Outlet, useLoaderData, redirect, Form } from "react-router";
import { getOptionalUser, logoutUser } from "./user-components/user-api";
import { LogOut, Link2, User as UserIcon } from "lucide-react";

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
    <div className="layout">
      <header className="app-header">
        <div className="header-container">
          <Link to="/" className="app-brand" title="ClipLink Home">
            <div className="brand-logo-badge">
              <Link2 size={20} />
            </div>
            <span className="brand-title">ClipLink</span>
          </Link>

          {user ? (
            <nav className="header-nav-user">
              <div className="user-profile-badge">
                <div className="user-avatar-circle">
                  <UserIcon size={15} />
                </div>
                <span className="user-name">Welcome, {user.firstName}</span>
              </div>
              <Form method="post">
                <button
                  type="submit"
                  className="header-logout-btn"
                  title="Sign out of your account"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </Form>
            </nav>
          ) : (
            <nav className="header-nav-guest">
              <Link to="/login" className="nav-btn-login">
                Sign In
              </Link>
              <Link to="/register" className="nav-btn-register">
                Get Started
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="main-content">
        <Outlet context={user} />
      </main>
    </div>
  );
}
