import React, { createContext, useContext, useState } from "react";
import { api } from "../api/client";
import { User } from "../types";

type Ctx = { user: User | null; login: (email: string, password: string) => Promise<void>; logout: () => void; };
const AuthContext = createContext<Ctx>(null!);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
