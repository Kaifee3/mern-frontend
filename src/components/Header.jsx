import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../App";
import "./CSS/Header.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Header() {
  const { user, cart, setProducts } = useContext(AppContext);
  const [searchVal, setSearchVal] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products?search=${searchVal}`);
      const found = response.data.products;

      if (found.length > 0) {
        setProducts(found);
        setError("");
      } else {
        setProducts([]);
        setError("Product not found");
        setTimeout(() => setError(""), 2000);
      }
    } catch (err) {
      console.error("Error searching:", err);
      setError("Search failed");
      setTimeout(() => setError(""), 2000);
    }
  };

  const cartCount = cart?.reduce((acc, item) => acc + item.qty, 0) || 0;

  return (
    <div className="navbar">
      <a href="/" className="logo">
        <img src="/images/logo.png" alt="Logo" />
      </a>
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search products..."
        />
        <button onClick={handleSearch}>Search</button>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        <Link to="/order">Order</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {user?.token ? <Link to="/profile">Profile</Link> : <Link to="/login">Login</Link>}
        {user?.firstName && (
          <div className="welcome-text">Hello, {user.firstName}</div>
        )}
      </div>
      {error && <div className="not-found-popup">{error}</div>}
    </div>
  );
}
