"use client"; // <-- MUST be at the very top

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to MyApp</h1>
      <p className="mb-8 text-lg text-gray-700">Please login  to continue</p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>
        {/* <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          Register
        </button> */}
      </div>
    </div>
  );
}
