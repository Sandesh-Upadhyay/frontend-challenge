"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/user";

interface MenuItem {
  label: string;
  path: string;
  roles: Role[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard", roles: ["MANAGER"] },
  { label: "Products", path: "/products", roles: ["MANAGER", "STORE_KEEPER"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();

  const allowedItems = MENU_ITEMS.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-colors">
      <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-700">
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          Commodities
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {allowedItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="border-t border-gray-200 p-3 dark:border-gray-700">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {user.role.replace("_", " ")}
          </p>
        </div>
      )}
    </aside>
  );
}
