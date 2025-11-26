"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookie is set
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Success → Redirect to dashboard immediately
      // The AuthContext will fetch the new user data on mount
      router.push("/dashboard");

    } catch (err: any) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 border p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <span className="font-medium">
          Contact your SuperAdmin to create your account
        </span>
      </p>
    </div>
  );
}
