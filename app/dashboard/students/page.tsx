"use client";

import { useEffect, useState } from "react";
import StudentTable from "@/components/students/StudentTable";
import AddStudentSlider from "@/components/students/AddStudentSlider";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function StudentsPage() {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
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

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );

  // Only superadmin & teachers can view this page
  if (user && user.role !== "superadmin" && user.role !== "teacher") {
    return (
      <p className="text-center text-red-600 mt-10 text-lg md:text-xl">
        ❌ You are not authorized to access Student Management.
      </p>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Students</h1>

        {/* Only superadmin & teachers can add students */}
        <button
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer transition font-medium"
        >
          {isMobile ? '+ Add' : '+ Add Student'}
        </button>
      </div>

      {/* Student Table - Responsive wrapper */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <StudentTable
          students={students}
          refresh={fetchStudents}
        />
      </div>

      {/* Create Student Drawer */}
      <AddStudentSlider
        open={open}
        setOpen={setOpen}
        refresh={fetchStudents}
      />
    </div>
  );
}
