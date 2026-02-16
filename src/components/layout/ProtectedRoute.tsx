"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/user";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    if (allowedRoles && allowedRoles.length > 0) {
      const allowed = allowedRoles.some((role) => hasRole(role));
      if (!allowed) {
        router.replace("/unauthorized");
      }
    }
  }, [isAuthenticated, isLoading, allowedRoles, hasRole, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const allowed = allowedRoles.some((role) => hasRole(role));
    if (!allowed) {
      return null;
    }
  }

  return <>{children}</>;
}
