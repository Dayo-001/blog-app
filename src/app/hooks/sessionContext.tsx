"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient, signOut } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

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
