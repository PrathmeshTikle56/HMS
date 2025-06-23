export const PERMISSIONS = {
  SuperAdmin: {
    users: ['read', 'write', 'update', 'delete'],
    leaves: ['read', 'write', 'update', 'delete', 'readAll'],
    attendance: ['read', 'write', 'update', 'delete'],
  },
  Admin: {
    users: ['read', 'write', 'update', 'delete'],
    leaves: ['read', 'write', 'update', 'delete', 'readAll'],
    attendance: ['read', 'write', 'update', 'delete'],
  },
  Manager: {
    users: ['read', 'write', 'delete'],
    leaves: ['read', 'update', 'readAll'],
    attendance: ['read', 'write', 'update', 'readAll'],
  },
  HR: {
    users: ['read', 'write', 'update'],
    leaves: ['read', 'update', 'readAll'],
    attendance: ['read', 'write', 'update'],
  },
  Employee: {
    users: ['read'],
    leaves: ['read', 'write'],
    attendance: ['read', 'write'],
  },
};
