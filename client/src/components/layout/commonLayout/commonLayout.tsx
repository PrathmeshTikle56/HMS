import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/hooks";
import { Menu, X } from "lucide-react";
import { commonRoutes, roleRoutes } from "../../../routes/routeConfig";

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  const role = useAppSelector((state) => state.user.user?.role);
  const roleLinks = role && roleRoutes[role] ? roleRoutes[role] : [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow z-20">
        <h1 className="text-xl font-semibold">
          {role === "admin" ? "Admin" : "Employee"}
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-72 bg-gray-800 text-white z-30 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center">
            {" "}
            {role === "admin" ? "Admin" : "Employee"}
          </h2>
          <nav className="mt-6 space-y-2">
            {roleLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 py-2.5 px-4 rounded hover:bg-gray-700 transition ${
                  location.pathname === to ? "bg-gray-700" : ""
                }`}
              >
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-20 md:pt-6 md:pl-6 pr-4 pb-6 overflow-y-auto z-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
