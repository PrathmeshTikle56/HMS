import React, { useState } from "react";
import { Menu, X, Bell, Mail, Settings } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { EmployeeNavLink } from "./EmployeeInterface";

const EmployeeLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navLinks: EmployeeNavLink[] = [
    { label: "Dashboard", path: "dashboard" },
    { label: "Profile", path: "profile" },
    { label: "Leaves", path: "leaves" },
    { label: "Payroll", path: "payroll" },
    { label: "Attendance", path: "attendance" },
  ];
  return (
    <>
      <header className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="text-xl font-semibold text-blue-600">
              <Link to="/">Startappss Portal</Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={`/employee/${link.path.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-20">
              <div className="hidden md:flex space-x-10 text-gray-600">
                <Bell className="bg-hover:text-blue-600 cursor-pointer" />
                <Mail className="hover:text-blue-600 cursor-pointer" />
                <Settings className="hover:text-blue-600 cursor-pointer" />
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-800 focus:outline-none"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* -----MobileView-------- */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md px-4 pb-4 pt-2 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={`${link.path.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-blue-600 font-medium transition"
              >
                {link.label}
              </Link>
            ))}
            <hr />
            <div className="flex justify-evenly text-gray-600 pt-2">
              <Bell className="hover:text-blue-600 cursor-pointer" />
              <Mail className="hover:text-blue-600 cursor-pointer" />
              <Settings className="hover:text-blue-600 cursor-pointer" />
            </div>
          </div>
        )}
      </header>

      <main className="mt-20">
        <Outlet />
      </main>
    </>
  );
};

export default EmployeeLayout;
