import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  Clock,
  User,
  LogOut,
  Bell,
  Mail,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import profileImage from "../../../assets/user-alt.svg";

const EmployeeLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const role = user?.role || "employee";
  const name = user?.name || "Employee";

  const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Attendance", path: "/attendance", icon: UserCheck },
    { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
    { label: "Approval History", path: "/approval-history", icon: Clock },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-5 shadow-lg">
        
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img src="/logo.jpg" alt="Logo" className="w-30 bg-amber-50 " />
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-4 p-3 bg-[#1e293b] rounded-xl mb-6 shadow">
          <img
            src={user?.profileImage || profileImage}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold capitalize">{name}</span>
            <span className="text-sm text-gray-300 capitalize">{role}</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex flex-col gap-2 flex-grow">
          {sidebarLinks.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:bg-yellow-600 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-x-auto bg-gray-100 w-300">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg w-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Mail size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Content Display */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full min-h-[calc(100vh-150px)]">
          <h1 className="text-xl font-bold mb-4">Welcome, {name}</h1>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
