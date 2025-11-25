"use client";

import { useEffect, useState } from "react";
import TeacherTable from "@/components/teachers/TeacherTable";
import AddTeacherSlider from "@/components/teachers/AddTeacherSlider";
import { useAuth } from "@/context/AuthContext";

export default function TeachersPage() {
  const { user, isLoading } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // ------------------------------
  // Fetch Teachers
  // ------------------------------
  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.log("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  // Only superadmin & teachers can view this page
  if (user && user.role !== "superadmin" && user.role !== "teacher") {
    return (
      <p className="text-center text-red-600 mt-10 text-xl">
        ❌ You are not authorized to access Teacher Management.
      </p>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Teachers</h1>

        {/* Only superadmin & teacher can add teachers */}
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
        >
          + Add Teacher
        </button>
      </div>

      {/* Teacher Table */}
      <TeacherTable
        teachers={teachers}
        refresh={fetchTeachers}
      />

      {/* Create Teacher Drawer */}
      <AddTeacherSlider
        open={open}
        setOpen={setOpen}
        refresh={fetchTeachers}
      />
    </div>
  );
}
