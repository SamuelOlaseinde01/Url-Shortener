import { LogOut } from "lucide-react";
import React from "react";
import { Link } from "react-router";

export default function Logout() {
  return (
    <div className="logout">
      <div className="logout-container">
        <LogOut />
        <h2>Logout Successful</h2>
        <p>You have been successfully logged out. Thank you for visiting!</p>
        <Link to={"/"}>Go to Home </Link>
      </div>
    </div>
  );
}
