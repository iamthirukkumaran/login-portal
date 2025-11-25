"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Route based on role
      if (user.role === "superadmin") {
        router.push("/dashboard/teachers");
      } else if (user.role === "teacher") {
        router.push("/dashboard/students");
      } else if (user.role === "student") {
        router.push("/dashboard/profile");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl font-semibold">Redirecting...</p>
    </div>
  );
}
