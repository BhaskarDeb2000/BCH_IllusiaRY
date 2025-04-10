import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ItemsPage from "../pages/ItemsPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />

      {/* Dashboard and nested routes */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="items" element={<ItemsPage />} />
        <Route path="my-bookings" element={<MyBookingsPage />} />
      </Route>
    </Routes>
  );
}
