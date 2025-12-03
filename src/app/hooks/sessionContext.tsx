"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient, signOut } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { startHolyLoader, stopHolyLoader } from "holy-loader";

export type UserSession = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
};

export interface SessionContextType {
  error: string | null;
  user: UserSession | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  error: null,
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function fetchSession() {
    try {
      startHolyLoader();
      const res = await authClient.getSession();
      if (res.data) {
        setUser(
          res.data.user
            ? { ...res.data.user, image: res.data.user.image ?? undefined }
            : null
        );
      } else {
        setUser(null);
      }
    } catch (error) {
      stopHolyLoader();
      console.error("Error fetching session:", error);
    } finally {
      stopHolyLoader();
      setLoading(false);
    }
  }

  async function logout() {
    try {
      startHolyLoader();
      setLoading(true);
      const result = await signOut();
      if (result.error) {
        setError(result.error.message ?? null);
      } else {
        await fetchSession();
        router.push("/");
      }
    } catch (error) {
      stopHolyLoader();
      console.error("Can not sign you out at this time", error);
    } finally {
      stopHolyLoader();
      setLoading(false);
    }
  }

  async function refresh() {
    startHolyLoader();
    setLoading(true);
    await fetchSession();
    stopHolyLoader();
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
