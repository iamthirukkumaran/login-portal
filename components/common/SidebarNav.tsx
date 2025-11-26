"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Users, BookOpen, LogOut, LayoutDashboard, User } from "lucide-react";

export default function SidebarNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // Force page refresh to clear all client-side state
    router.refresh();
    // Small delay to ensure logout completes
    setTimeout(() => {
      router.push("/login");
    }, 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-600">Management</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* SUPERADMIN ONLY */}
        {user && user.role === "superadmin" && (
          <>
            {/* <Link href="/dashboard">
              <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </div>
            </Link> */}

            <Link href="/dashboard/teachers">
              <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
                <Users size={20} />
                <span>Teachers</span>
              </div>
            </Link>

            <Link href="/dashboard/students">
              <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
                <BookOpen size={20} />
                <span>Students</span>
              </div>
            </Link>
          </>
        )}

        {/* TEACHER ONLY */}
        {user && user.role === "teacher" && (
          <Link href="/dashboard/students">
            <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
              <BookOpen size={20} />
              <span>Students</span>
            </div>
          </Link>
        )}

        {/* STUDENT ONLY */}
        {user && user.role === "student" && (
          <Link href="/dashboard/profile">
            <div className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
              <User size={20} />
              <span>My Profile</span>
            </div>
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded hover:bg-red-50 text-red-600"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
