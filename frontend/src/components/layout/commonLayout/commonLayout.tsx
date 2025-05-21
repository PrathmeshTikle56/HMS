import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../../hooks/hooks";
import { Menu, X } from "lucide-react";

// Import role-based layouts
import AdminLayout from "../AdminLayout/AdminLayout";
import EmployeeLayout from "../EmployeeLayout/EmployeeLayout";

// Add other layouts as needed (e.g., HRLayout, SuperAdminLayout)

const CommonLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  const role = useAppSelector((state) => state.user.user?.role);

  // Dynamically render layout based on role
  const renderRoleLayout = () => {
    switch (role) {
      case "admin":
      case "hr":
      case "superadmin":
        return <AdminLayout />;
      case "employee":
        return <EmployeeLayout />;
      default:
        return <div className="p-6 text-red-500">No layout found for role.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow z-20">
        <h1 className="text-xl font-semibold capitalize">{role} Panel</h1>
        <button onClick={toggleSidebar} className="text-gray-700">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Render Role-Specific Sidebar Layout */}
      <div className="flex flex-1">
        {renderRoleLayout()}
      </div>
    </div>
  );
};

export default CommonLayout;
