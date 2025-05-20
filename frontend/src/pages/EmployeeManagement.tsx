import React, { useEffect, useState } from "react";
import Table from "../components/Table/Table";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/Modal/ConfirmModal";

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const headers = ["profile", "id", "name", "role", "doj", "dept", "actions"];
  const [employeeData, setEmployeeData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("/employeeTable.json")
      .then((res) => res.json())
      .then((data) => setEmployeeData(data))
      .catch((error) => console.log(error));
  }, []);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    navigate("/admin/create-user/");
  };

  return (
    <>
      <div className="p-2">
        <h1 className="flex flex-wrap font-bold">
          DashBoard/Employee Management
        </h1>
        <div className="flex justify-end p-2">
          <button
            className="p-2 flex justify-between items-center gap-2 bg-black text-white rounded cursor-pointer"
            onClick={handleAddClick}
          >
            Add Employee <UserPlus size={16} />
          </button>
        </div>
        <Table headers={headers} data={employeeData} />
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        message="Are you sure you want to add a new employee?"
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        confirmText="Yes, Add"
        cancelText="Cancel"
      />
    </>
  );
};

export default EmployeeManagement;
