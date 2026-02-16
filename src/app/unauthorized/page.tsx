"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900 transition-colors">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Access denied
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          You do not have permission to view this page.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
        >
          Go to Products
        </Link>
      </div>
    </div>
  );
}
