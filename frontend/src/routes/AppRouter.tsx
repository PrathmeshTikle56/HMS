import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoutes";
import Layout from "../components/layout/commonLayout/commonLayout";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";

// Admin pages
import AdminDashboard from "../pages/AdminDashBoard";
import UserManagement from "../pages/EmployeeManagement";
import Attendance from "../pages/Attendance";
import LeaveRequests from "../pages/LeaveManagement";
import ApprovalHistory from "../pages/ApprovalHistory";
import Profile from "../pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Common layout for dashboard (if used for other roles) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
            <Layout />
          </ProtectedRoute>
        }
      />

      {/* Admin layout routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "superadmin", "hr", "employee"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="approval-history" element={<ApprovalHistory/>} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
