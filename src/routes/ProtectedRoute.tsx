import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Educational guard: a guest who opens /checkout (or /orders, /profile) goes to /login.
 * `state.from` remembers where they came from, so after logging in
 * the Login page sends them back there.
 * Pages behind it never check the login again — one place, one rule.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
