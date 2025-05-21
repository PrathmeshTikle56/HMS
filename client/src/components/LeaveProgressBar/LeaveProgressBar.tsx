import React from "react";
import { MoreVertical } from "lucide-react";
export interface LeaveType {
  type: "Sick Leave" | "Casual Leave" | "Annual Leave";
  used: number;
  total: number;
}

interface LeaveProgressBarProps {
  leaveData: LeaveType[];
}

const LeaveProgressBar: React.FC<LeaveProgressBarProps> = ({ leaveData }) => {
  return (
    <div className="space-y-6 w-full h-full bg-white  py-10 px-5 shadow-md">
      <div className="flex justify-between p-2">
        <h1 className="text-3xl">Available Leave Days</h1>
        <button>
          <MoreVertical className="w-5 h-5 text-gray-600 font-bold" />
        </button>
      </div>

      {leaveData.map((leave, index) => {
        const percent = Math.min((leave.used / leave.total) * 100, 100);
        return (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{leave.type}</span>
              <span>
                {leave.used}/{leave.total}
              </span>
            </div>
            <div className="w-full bg-gray-200  h-4">
              <div
                className={`h-4 bg-[#253D90]`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaveProgressBar;
