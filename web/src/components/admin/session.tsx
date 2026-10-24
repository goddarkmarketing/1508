"use client";

import { createContext, useContext } from "react";
import type { SessionUser } from "@/lib/auth";

const AdminSessionContext = createContext<SessionUser | null>(null);

export function AdminSessionProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return <AdminSessionContext.Provider value={user}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const value = useContext(AdminSessionContext);
  if (!value) {
    throw new Error("Admin session is missing");
  }
  return value;
}
