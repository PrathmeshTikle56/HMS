export const PERMISSIONS = {
  SuperAdmin: {
    users: ['read', 'write', 'update', 'delete'],
    leaves: ['read', 'write', 'update', 'delete', 'readAll'],
    attendance: ['read', 'write', 'update', 'delete', 'readAll'],
  },
  Admin: {
    users: ['read', 'write', 'update', 'delete'],
    leaves: ['read', 'write', 'update', 'delete', 'readAll'],
    attendance: ['read', 'write', 'update', 'delete', 'readAll'],
  },
  Manager: {
    users: ['read', 'write', 'delete'],
    leaves: ['read', 'write', 'update', 'readAll'],
    attendance: ['read', 'write', 'readAll'],
  },
  HR: {
    users: ['read', 'write', 'update'],
    leaves: ['read', 'write', 'update', 'readAll'],
    attendance: ['read', 'readAll'],
  },
  Employee: {
    users: ['read'],
    leaves: ['read', 'write'],
    attendance: ['read', 'write'],
  },
};
