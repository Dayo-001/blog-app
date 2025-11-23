"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient, signOut } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

const SessionContext = createContext({
  error: null,
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const router = useRouter();

  async function fetchSession() {
    try {
      const res = await authClient.getSession();
      if (res.data) {
        setUser(res.data.user ?? null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      const result = await signOut();
      if (result.error) {
        setError(result.error.message ?? null);
      } else {
        await fetchSession();
        router.push("/");
      }
    } catch (error) {
      console.error("Can not sign you out at this time", error);
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setLoading(true);
    await fetchSession();
  }

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ error, user, loading, refresh, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
