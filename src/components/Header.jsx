import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import App, { AppContext } from "../App";
import "./Header.css";
export default function Header() {
  const { user } = useContext(AppContext);
  return (
    <div>
      <div className="navbar">
  <h1>AK Frontend</h1>
  <div className="nav-links">
    <Link to="/">Home</Link>
    <Link to="/cart">MyCart</Link>
    <Link to="/order">MyOrder</Link>
    {user?.role === "admin" && <Link to="/admin">Admin</Link>}
    {user?.token ? (
      <Link to="/profile">Profile</Link>
    ) : (
      <Link to="/login">Login</Link>
    )}
  </div>
</div>



    </div>
  );
}
