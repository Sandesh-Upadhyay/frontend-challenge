"use client";

import { ApolloProvider } from "@apollo/client";
import { type ReactNode } from "react";
import { apolloClient } from "@/lib/apolloClient";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
