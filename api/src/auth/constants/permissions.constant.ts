/* eslint-disable prettier/prettier */
export const PERMISSIONS = {
  Admin: {
    users: ['read', 'write', 'update', 'delete'],
    leaves: ['read', 'write', 'update', 'delete'],
    attendance: ['read', 'write', 'update', 'delete'],
  },
  Manager: {
    users: ['read', 'write'], // Managers can only read/write user data
    leaves: ['read', 'update'], // Managers can update leaves
    attendance: ['read', 'write'], // Managers can mark attendance
  },
  HR: {
    users: ['read', 'write', 'update'], 
    leaves: ['read', 'update', 'readAll'], 
    attendance: ['read'], 
  },
  Employee: {
    users: ['read'], // Employees can only read their own data
    leaves: ['read', 'write'], // Employees can apply for leaves
    attendance: ['read', 'write'], // Employees can mark attendance
  },
};
