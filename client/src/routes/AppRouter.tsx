import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoutes";
import Layout from "../components/layout/commonLayout/commonLayout";
import { Sidebar, SlidersVertical } from "lucide-react";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
            <Layout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
