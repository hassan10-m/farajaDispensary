import React, { createContext, useContext, useState } from 'react';
import { Session } from '../data/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(Session.get());

  function login(u) {
    Session.set(u);
    setUser(u);
  }

  function logout() {
    Session.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
