"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, Role } from "@/types/user";

const STORAGE_TOKEN = "accessToken";
const STORAGE_USER = "user";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAuth(): { accessToken: string | null; user: User | null } {
  if (typeof window === "undefined") {
    return { accessToken: null, user: null };
  }
  try {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const userJson = localStorage.getItem(STORAGE_USER);
    const user = userJson ? (JSON.parse(userJson) as User) : null;
    return { accessToken: token, user };
  } catch {
    return { accessToken: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { accessToken: token, user: u } = loadStoredAuth();
    setAccessToken(token);
    setUser(u);
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, u: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_TOKEN, token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(u));
    }
    setAccessToken(token);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: Role) => {
      return user?.role === role;
    },
    [user?.role]
  );

  const isAuthenticated = !!user && !!accessToken;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      login,
      logout,
      isAuthenticated,
      hasRole,
      isLoading,
    }),
    [user, accessToken, login, logout, isAuthenticated, hasRole, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
