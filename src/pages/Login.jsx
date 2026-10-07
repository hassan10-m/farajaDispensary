import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from '../data/storage.js';
import { useAuth } from '../components/AuthContext.jsx';

const ROLE_OPTIONS = [
  { value: 'reception', label: 'Receptionist' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'manager', label: 'Manager' },
];

const EMPTY_REGISTER_FORM = { name: '', username: '', password: '', confirmPassword: '', role: 'reception' };

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const { login } = useAuth();
  const navigate = useNavigate();

  // ---- Login state ----
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  function handleLogin(e) {
    e.preventDefault();
    const user = Users.findByUsername(username.trim());
    if (!user || user.password !== password) {
      setLoginError('Incorrect username or password.');
      return;
    }
    login(user);
    navigate('/');
  }

  // ---- Register state ----
  const [form, setForm] = useState(EMPTY_REGISTER_FORM);
  const [errors, setErrors] = useState({});
  const [registered, setRegistered] = useState(false);

  function validateRegister() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (Users.usernameExists(form.username.trim())) errs.username = 'This username is already taken';
    if (!form.password || form.password.length < 4) errs.password = 'Password must be at least 4 characters';
    if (form.confirmPassword !== form.password) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  function handleRegister(e) {
    e.preventDefault();
    const errs = validateRegister();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    Users.add({
      name: form.name,
      username: form.username.trim(),
      password: form.password,
      role: form.role,
    });
    setForm(EMPTY_REGISTER_FORM);
    setErrors({});
    setRegistered(true);
  }

  function switchToLogin() {
    setMode('login');
    setRegistered(false);
    setUsername(form.username || username);
    setLoginError('');
  }

  return (
    <div className="login-wrap">
      <div className="login-card" style={{ width: 360 }}>
        <h1>Dispensary System</h1>
        <p className="sub">{mode === 'login' ? 'Log in to continue' : 'Create a staff account'}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button
            type="button"
            className={mode === 'login' ? 'primary' : 'ghost'}
            style={{ flex: 1 }}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'primary' : 'ghost'}
            style={{ flex: 1 }}
            onClick={() => { setMode('register'); setRegistered(false); }}
          >
            Register
          </button>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {loginError && <p className="error-text">{loginError}</p>}
            <button className="primary" type="submit" style={{ width: '100%' }}>Log in</button>
    
          </form>
        )}

        {mode === 'register' && !registered && (
          <form onSubmit={handleRegister}>
            <label>Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
            {errors.name && <p className="error-text">{errors.name}</p>}

            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            {errors.username && <p className="error-text">{errors.username}</p>}

            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {errors.password && <p className="error-text">{errors.password}</p>}

            <label>Confirm password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

            <button className="primary" type="submit" style={{ width: '100%' }}>Create account</button>
          </form>
        )}

        {mode === 'register' && registered && (
          <div>
            <div className="hint-box" style={{ marginBottom: 14 }}>
              Account created. You can now log in with your new username and password.
            </div>
            <button className="primary" style={{ width: '100%' }} onClick={switchToLogin}>Go to log in</button>
          </div>
        )}
      </div>
    </div>
  );
}
