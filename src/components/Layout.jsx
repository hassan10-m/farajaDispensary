import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const ROLE_LABEL = {
  reception: 'Receptionist',
  doctor: 'Doctor',
  pharmacist: 'Pharmacist',
  manager: 'Manager',
};

// Each menu item lists the roles allowed to see it
const MENU_ITEMS = [
  { path: '/', label: 'Dashboard', roles: ['reception', 'doctor', 'pharmacist', 'manager'] },
  { path: '/patients', label: 'Patients', roles: ['reception', 'doctor', 'manager'] },
  { path: '/queue', label: 'Treatment queue', roles: ['reception', 'doctor', 'manager'] },
  { path: '/pharmacy', label: 'Medicines & stock', roles: ['pharmacist', 'manager'] },
  { path: '/billing', label: 'Billing', roles: ['manager', 'reception'] },
  { path: '/reports', label: 'Reports', roles: ['manager'] },
  { path: '/users', label: 'Manage users', roles: ['manager'] },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const menuForUser = MENU_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <div className="app-shell">
      <nav className="sidebar">
        <h1>Dispensary</h1>
        <div className="role-tag">{user.name} · {ROLE_LABEL[user.role]}</div>
        {menuForUser.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
        <button className="logout" onClick={handleLogout}>Log out</button>
      </nav>
      <div className="content">{children}</div>
    </div>
  );
}
