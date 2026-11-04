import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { userStorage } from "@/models/StorageService";
import type { AuthUser, ProfileFormValues } from "@/types/user";
import { AuthContext, type AuthContextValue } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Educational login — a local simulation in React state.
 * Any non-empty username + password (6+ chars) logs you in; no server, no real credentials.
 * Only the username and profile fields are kept in shop_user (never the password),
 * so the session survives a page refresh (optional in the PRD).
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => userStorage.get());

  useEffect(() => {
    if (user) userStorage.set(user);
    else userStorage.remove();
  }, [user]);

  const login = useCallback((username: string) => {
    setUser({ username: username.trim(), firstName: "", lastName: "", email: "", phone: "" });
  }, []);

  // Logout returns to guest; the cart is NOT cleared (P0.3)
  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((values: ProfileFormValues) => {
    setUser((current) =>
      current
        ? {
            ...current,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
          }
        : current,
    );
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
    return {
      user,
      isLoggedIn: user !== null,
      displayName: fullName || user?.username || "Guest",
      login,
      logout,
      updateProfile,
    };
  }, [user, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
