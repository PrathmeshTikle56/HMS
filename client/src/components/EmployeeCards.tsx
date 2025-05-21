import React from "react";

type EmployeeCardProps = {
  name: string;
  role: string;
  imageUrl: string;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  name,
  role,
  imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUpiglNG5F4DdRpAG_jVCrqsQVX4P2d4jLzQ&s",
}) => {
  return (
    <div className="flex items-center justify-between bg-blue-900 p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex items-center gap-2">
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 rounded-full  border-4 border-gray-200 mb-4 "
        />
        <div className="flex h-auto flex-col gap-2 items-center">
          <h3 className="md:text-3xl font-semibold text-white sm:text-xl">
            {name}
          </h3>
          <p className="md:text-xl text-gray-300 sm:text-sm">{role}</p>
        </div>
      </div>
      <button className="bg-white text-black p-2 rounded-sm cursor-pointer hover:bg-blue-50">
        Edit Profile
      </button>
    </div>
  );
};

export default EmployeeCard;
