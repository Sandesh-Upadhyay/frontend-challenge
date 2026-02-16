"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useAuth } from "@/context/AuthContext";
import { LOGIN } from "@/graphql/mutations";
import type { User } from "@/types/user";
import { LoginForm, type LoginFormValues } from "@/components/forms/LoginForm";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [loginMutation, { loading: mutationLoading, error }] = useMutation<{
    login: { accessToken: string; user: User };
  }>(LOGIN);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, authLoading, router, redirect]);

  async function handleSubmit(values: LoginFormValues) {
    try {
      const { data } = await loginMutation({
        variables: { email: values.email, password: values.password },
      });
      if (data?.login) {
        login(data.login.accessToken, data.login.user);
        router.replace(redirect);
      }
    } catch {
      // Error is shown via error state from useMutation
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const rawMessage =
    error?.graphQLErrors?.[0]?.message ?? error?.message ?? null;
  const errorMessage =
    rawMessage === "Failed to fetch" || rawMessage?.includes("fetch")
      ? "Cannot connect to the server. Ensure the GraphQL API is running (e.g. http://localhost:3001/graphql) and CORS is allowed."
      : rawMessage;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors">
        <h1 className="mb-2 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
          Commodities Management
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Sign in to your account
        </p>
        <LoginForm
          onSubmit={handleSubmit}
          isLoading={mutationLoading}
          error={errorMessage}
        />
      </div>
    </div>
  );
}
