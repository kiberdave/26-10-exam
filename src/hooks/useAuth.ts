import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/context/AuthContext";

/** Custom hook: read the auth context; fails loudly if used outside <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
