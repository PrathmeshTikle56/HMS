import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  Clock,
  User,
  LogOut,
  Bell,
  Plus,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";

const mockEmployees = [
  { id: 1, name: "Ravi Sharma", role: "Developer", department: "IT", email: "ravi@example.com" },
  { id: 2, name: "Priya Mehta", role: "Designer", department: "UI/UX", email: "priya@example.com" },
  { id: 3, name: "Aman Verma", role: "Tester", department: "QA", email: "aman@example.com" },
];

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const role = user?.role || "guest";
  const [employees, setEmployees] = useState(mockEmployees);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const sidebarConfig: Record<string, { label: string; path: string; icon: React.ElementType }[]> = {
    superadmin: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "User & Role Mgmt", path: "/user-management", icon: Users },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
      { label: "Approval History", path: "/approval-history", icon: Clock },
      { label: "Profile", path: "/profile", icon: User },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
      { label: "Approval History", path: "/approval-history", icon: Clock },
      { label: "Profile", path: "/profile", icon: User },
    ],
    hr: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
      { label: "Approval History", path: "/approval-history", icon: Clock },
      { label: "Profile", path: "/profile", icon: User },
    ],
    employee: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
      { label: "Approval History", path: "/approval-history", icon: Clock },
      { label: "Profile", path: "/profile", icon: User },
    ],
  };

  const linksToShow = sidebarConfig[role] || [];

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-5 shadow-lg">
        <div className="text-2xl font-bold text-center mb-10">{role} Panel</div>
        <div className="flex flex-col gap-4 flex-grow">
          {linksToShow.map(({ label, path, icon: Icon }) => (
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
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="navbar flex justify-between items-center mb-6">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                  <Search size={18} />
                  Search
                </button>
                <button className="flex items-center gap-2 bg-green-500 hover:bg-gray-200 text-white-700 px-4 py-2 rounded-lg">
                  <Bell size={18} />
                </button>
        </div>
        {(role === "admin" || role === "superadmin") ? (
          <div className="bg-white p-6 rounded-xl shadow-xl">
            
            <div className="flex justify-between items-center mb-6">
                
              <h2 className="text-2xl font-semibold text-[#0f172a]">Employee Details</h2>
              <div className="flex gap-3">
                
                <button className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-lg">
                  <Plus size={18} />
                  Add Employee
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-[#e2e8f0] text-[#0f172a]">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-left">Email</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[#1e293b]">
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="border-t hover:bg-[#f1f5f9]">
                      <td className="px-4 py-3">{emp.id}</td>
                      <td className="px-4 py-3">{emp.name}</td>
                      <td className="px-4 py-3">{emp.role}</td>
                      <td className="px-4 py-3">{emp.department}</td>
                      <td className="px-4 py-3">{emp.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default AdminLayout;