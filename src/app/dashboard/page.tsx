"use client";

import { useQuery } from "@apollo/client";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { GET_DASHBOARD_STATS } from "@/graphql/queries";
import type { DashboardStats } from "@/types/product";

interface QueryData {
  dashboardStats: DashboardStats;
}

export default function DashboardPage() {
  const { data, loading, error } = useQuery<QueryData>(GET_DASHBOARD_STATS);

  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error.graphQLErrors?.[0]?.message ?? error.message}
            </div>
          )}
          {data?.dashboardStats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Products
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {data.dashboardStats.totalProducts}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Low Stock Items
                </p>
                <p className="mt-2 text-3xl font-semibold text-amber-600 dark:text-amber-400">
                  {data.dashboardStats.lowStockItems}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Categories
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {data.dashboardStats.totalCategories}
                </p>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
