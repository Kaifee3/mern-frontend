import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./CSS/Profile.css";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const [profile, setProfile] = useState({});
  const { user, setUser } = useContext(AppContext);
  const [form, setForm] = useState({});
  const [error, setError] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();
  const fetchProfile = async () => {
    try {
      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.get(url);
      setProfile(result.data);
      console.log(profile);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    setUser({});
    Navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const url = `${API_URL}/api/users/${profile._id}/profile`;
      const result = await axios.patch(url, form);
      fetchProfile();
      setError("Data saved successfully.");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };
  return (
  <div className="profile-container">
    <h3 className="profile-title">My Profile</h3>

    <div className="profile-input-group">
      <input
        name="firstName"
        type="text"
        onChange={handleChange}
        defaultValue={profile.firstName}
        placeholder="First Name"
      />
    </div>

    <div className="profile-input-group">
      <input
        name="lastName"
        type="text"
        onChange={handleChange}
        defaultValue={profile.lastName}
        placeholder="Last Name"
      />
    </div>

    <div className="profile-input-group">
      <input
        name="email"
        type="text"
        onChange={handleChange}
        defaultValue={profile.email}
        placeholder="Email"
      />
    </div>

    <div className="profile-input-group">
      <input
        name="password"
        type="password"
        onChange={handleChange}
        defaultValue={profile.password}
        placeholder="Password"
      />
    </div>

    <button className="profile-button" onClick={handleSubmit}>Update Profile</button>
    <button className="logout-button" onClick={logout}>Logout</button>
    
    {error && <p className="profile-message">{error}</p>}
  </div>
);
}
