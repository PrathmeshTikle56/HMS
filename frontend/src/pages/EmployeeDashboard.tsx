import React, { useState, useEffect } from "react";
import EmployeeCard from "../components/EmployeeCards";
import QuickBtnData from "../assets/data/QuickActionsBtn.json";
import Button from "../components/common/ButtonComp";
// import HolidayCalendar from "../components/Calendar/Calendar";
import Clock from "../components/Clock/clock";
import LeaveProgressBar from "../components/LeaveProgressBar/LeaveProgressBar";
import { LeaveType } from "../components/LeaveProgressBar/LeaveProgressBar";
import TaskBox from "../components/TaskBox/TaskBox";
import AnnouncementBox from "../components/Announcement/Announcement";
import BirthdayBox from "../components/BirthdayBox/BirthdayBox";
const EmployeeDashboard = () => {
  const leaveStats: LeaveType[] = [
    { type: "Sick Leave", used: 4, total: 10 },
    { type: "Casual Leave", used: 2, total: 5 },
    { type: "Annual Leave", used: 8, total: 15 },
  ];
  const birthdays = [
    { name: "Aisha Khan", date: "2025-04-28" },
    { name: "Ravi Patel", date: "2025-05-02" },
  ];

  const handleSendWish = (name: string) => {
    alert(`🎉 Birthday wish sent to ${name}!`);
  };

  return (
    <>
      <div className="w-full bg-blue-100 px-6 md:px-24 py-6">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-blue-950 p-2">DashBoard</h1>
        </div>

        <EmployeeCard
          imageUrl={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUpiglNG5F4DdRpAG_jVCrqsQVX4P2d4jLzQ&s"
          }
          name="Ankit Sharma"
          role="Frontend Developer"
        />
        <div>
          <h2 className="text-xl font-bold p-2">{QuickBtnData.label}</h2>

          <div className="flex flex-wrap gap-3">
            {Object.entries(QuickBtnData.content[0]).map(([key, label]) => (
              <Button
                name={label}
                key={key}
                cls={`bg-white :bg-gray-400 text-black cursor-pointer font-semibold py-2 px-10 rounded-3xl shadow-md focus:outline-none focus:shadow-outline min-w-[140px] text-center`}
              ></Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap w-full my-5">
          <div className="w-full h-96 md:w-1/2 p-2">
            <LeaveProgressBar leaveData={leaveStats} />
          </div>
          <div className="w-full md:w-1/2 p-2">
            <Clock />;
          </div>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap w-full my-5">
          <div className="w-full h-96 md:w-1/2 p-2">
            <BirthdayBox birthdays={birthdays} onSendWish={handleSendWish} />;
          </div>
          <div className="w-full md:w-1/2 p-2">
            <AnnouncementBox
              announcements={[
                {
                  title: "New Leave Policy",
                  content: "We’ve updated our leave policy effective May 1st.",
                },
                {
                  title: "System Downtime",
                  content:
                    "The HR portal will be under maintenance on Sunday from 2am to 4am.",
                },
                {
                  title: "Monthly Meetup",
                  content:
                    "Join us for the virtual town hall meeting this Friday at 3 PM.",
                },
              ]}
            />
          </div>
          <div className="flex flex-col md:flex-row flex-wrap w-full my-5">
            <div className="w-full h-96 md:w-1/2 p-2">
              <TaskBox
                tasks={[
                  "Design Login Page",
                  "Set up Redux",
                  "Implement JWT",
                  "Write Tests",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
