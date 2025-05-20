import React from "react";
import { Users, Wallet, Mail, FileText, BriefcaseBusiness } from "lucide-react";
import DashboardCard from "../components/DashboardCards/DashboardCrad";
import { useAppSelector } from "../hooks/hooks";

const AdminDashboard = () => {
  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p>Welcome, Admin !!</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <DashboardCard
          title="Total Employees"
          value={120}
          Icon={Users}
          borderColor="border-blue-500"
        />
        <DashboardCard
          title="Payslips Issued"
          value={430}
          Icon={Wallet}
          borderColor="border-green-500"
        />
        <DashboardCard
          title="Messages"
          value="12 New"
          Icon={Mail}
          borderColor="border-purple-500"
        />
        <DashboardCard
          title="Resumes Submitted"
          value={38}
          Icon={FileText}
          borderColor="border-yellow-500"
        />
        <DashboardCard
          title="Open Positions"
          value={5}
          Icon={BriefcaseBusiness}
          borderColor="border-pink-500"
        />
      </div>
    </>
  );
};

export default AdminDashboard;
