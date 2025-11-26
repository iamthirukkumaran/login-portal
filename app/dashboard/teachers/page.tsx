"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeacherTable from "@/components/teachers/TeacherTable";
import AddTeacherSlider from "@/components/teachers/AddTeacherSlider";
import { useAuth } from "@/context/AuthContext";

export default function TeachersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [teachers, setTeachers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Redirect students to their profile
  useEffect(() => {
    if (!isLoading && user && user.role === "student") {
      router.push("/dashboard/profile");
    }
  }, [user, isLoading, router]);

  // Fetch Teachers
  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();
      setTeachers(data.teachers || []);
      setFiltered(data.teachers || []);
    } catch (error) {
      console.log("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Live search (filter teachers)
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(teachers);
      return;
    }

    const s = search.toLowerCase();

    const matched = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(s)
    );

    setFiltered(matched);
  }, [search, teachers]);

  if (isLoading) return <p>Loading...</p>;

  // Only superadmin & teachers can access this page
  if (user && user.role !== "superadmin" && user.role !== "teacher") {
    return (
      <p className="text-center text-red-600 mt-10 text-xl">
        ❌ You are not authorized to access Teacher Management.
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Teachers</h1>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
        >
          + Add Teacher
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search teacher by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* Teacher Table */}
      <TeacherTable teachers={filtered} refresh={fetchTeachers} />

      {/* Add Teacher Drawer */}
      <AddTeacherSlider open={open} setOpen={setOpen} refresh={fetchTeachers} />
    </div>
  );
}
