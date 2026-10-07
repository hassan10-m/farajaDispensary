import React, { useState } from 'react';
import { Users } from '../data/storage.js';
import { useAuth } from '../components/AuthContext.jsx';

const EMPTY_FORM = { name: '', username: '', password: '', role: 'reception' };

const ROLE_OPTIONS = [
  { value: 'reception', label: 'Receptionist' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'manager', label: 'Manager' },
];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(Users.all());
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  function handleDelete(u) {
    if (u.id === currentUser.id) {
      window.alert("You can't delete your own account while logged in.");
      return;
    }
    const ok = window.confirm(`Delete user "${u.name}"? This cannot be undone.`);
    if (!ok) return;
    Users.remove(u.id);
    setUsers(Users.all());
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (Users.usernameExists(form.username.trim())) errs.username = 'This username is already taken';
    if (!form.password || form.password.length < 4) errs.password = 'Password must be at least 4 characters';
    return errs;
  }

  function handleSave(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    Users.add({ ...form, username: form.username.trim() });
    setUsers(Users.all());
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(false);
  }

  return (
    <div>
      <h2>Manage users</h2>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? 16 : 0 }}>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14 }}>
            Register a new staff account for any role.
          </p>
          <button className="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close' : 'Register user'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div>
                <label>Full name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
              <div>
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Username</label>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>
            </div>
            <button className="primary" type="submit">Save user</button>
          </form>
        )}
      </div>

      <div className="card">
        {users.length === 0 ? (
          <div className="empty-state">No users yet.</div>
        ) : (
          <table>
            <thead><tr><th>Name</th><th>Username</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.username}</td>
                  <td>{ROLE_OPTIONS.find((r) => r.value === u.role)?.label || u.role}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="ghost"
                      style={{ color: 'var(--red)', borderColor: 'var(--red)', padding: '6px 12px', fontSize: 13 }}
                      onClick={() => handleDelete(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
