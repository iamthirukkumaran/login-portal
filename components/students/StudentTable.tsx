"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  mark12?: number;
}

interface StudentTableProps {
  students: Student[];
  refresh: () => Promise<void>;
}

export default function StudentTable({ students, refresh }: StudentTableProps) {
  const deleteStudent = async (id: string) => {
    const res = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Student deleted");
      refresh();
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">12th Marks</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.phone || "-"}</td>
                <td className="p-3">{s.city || "-"}</td>
                <td className="p-3">{s.mark12 || "-"}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <Link href={`/dashboard/profile?id=${s._id}`}>
                    <Button size="sm" variant="outline" title="View Profile" className="cursor-pointer">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteStudent(s._id)}
                    title="Delete Student"
                    className="cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="p-5 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
