"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-3">
        {students.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No students found. Add one to get started!
            </CardContent>
          </Card>
        ) : (
          students.map((s) => (
            <Card key={s._id} className="border-l-4 border-l-blue-600">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{s.name}</h3>
                    <p className="text-sm text-gray-600">{s.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/profile?id=${s._id}`}>
                      <Button size="sm" variant="outline" className="cursor-pointer p-1 h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteStudent(s._id)}
                      className="cursor-pointer p-1 h-8 w-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{s.phone || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">City:</span>
                    <p className="font-medium">{s.city || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">12th Marks:</span>
                    <p className="font-medium">{s.mark12 || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Desktop Table View
  return (
    <Card>
      <CardContent className="p-4">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              <th className="p-3 text-left text-sm font-semibold">Email</th>
              <th className="p-3 text-left text-sm font-semibold">Phone</th>
              <th className="p-3 text-left text-sm font-semibold">City</th>
              <th className="p-3 text-left text-sm font-semibold">12th Marks</th>
              <th className="p-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-sm">{s.name}</td>
                <td className="p-3 text-sm">{s.email}</td>
                <td className="p-3 text-sm">{s.phone || "-"}</td>
                <td className="p-3 text-sm">{s.city || "-"}</td>
                <td className="p-3 text-sm">{s.mark12 || "-"}</td>
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
