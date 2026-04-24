"use client";

import { useEffect, useState } from "react";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/lib/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setToken(getStoredToken());
    setIsReady(true);
  }, []);

  function login(nextToken: string) {
    setStoredToken(nextToken);
    setToken(nextToken);
  }

  function logout() {
    clearStoredToken();
    setToken(null);
  }

  return {
    isAuthenticated: Boolean(token),
    isReady,
    login,
    logout,
    token
  };
}
