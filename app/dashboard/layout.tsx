"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import SidebarNav from "@/components/common/SidebarNav";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">

      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className={`${
        isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }` 
          : 'w-64 bg-white border-r shadow-sm'
      }`}>
        <SidebarNav />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        
        {/* Top Bar */}
        <header className="w-full bg-white shadow-sm px-3 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-30">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <h1 className="text-lg md:text-xl font-semibold">Dashboard</h1>

          {/* User Info */}
          {user && (
            <div className="text-xs md:text-sm font-medium flex items-center gap-2">
              <span className="hidden sm:inline">Logged in as:</span>
              <span className="text-blue-600 font-semibold">{user.name.split(' ')[0]}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                {user.role?.toUpperCase()}
              </span>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-3 md:p-6 md:bg-gray-50">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
