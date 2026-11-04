import { createContext } from "react";
import type { AuthUser, ProfileFormValues } from "@/types/user";

export interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  /** Display name for the header: "Dato Chaduneli" or the username */
  displayName: string;
  login: (username: string) => void;
  logout: () => void;
  updateProfile: (values: ProfileFormValues) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
