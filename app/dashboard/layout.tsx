"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import SidebarNav from "@/components/common/SidebarNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <SidebarNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Bar */}
        <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          {/* User Info */}
          {user && (
            <div className="text-sm font-medium">
              Logged in as: <span className="text-blue-600">{user.name}</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                {user.role?.toUpperCase()}
              </span>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
