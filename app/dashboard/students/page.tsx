"use client";

import { useEffect, useState } from "react";
import StudentTable from "@/components/students/StudentTable";
import AddStudentSlider from "@/components/students/AddStudentSlider";
import { useAuth } from "@/context/AuthContext";

export default function StudentsPage() {
  const { user, isLoading } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();
      setStudents(data.students || []);
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  // Only superadmin & teachers can view this page
  if (user && user.role !== "superadmin" && user.role !== "teacher") {
    return (
      <p className="text-center text-red-600 mt-10 text-xl">
        ❌ You are not authorized to access Student Management.
      </p>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Students</h1>

        {/* Only superadmin & teachers can add students */}
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
        >
          + Add Student
        </button>
      </div>

      {/* Student Table */}
      <StudentTable
        students={students}
        refresh={fetchStudents}
      />

      {/* Create Student Drawer */}
      <AddStudentSlider
        open={open}
        setOpen={setOpen}
        refresh={fetchStudents}
      />
    </div>
  );
}
