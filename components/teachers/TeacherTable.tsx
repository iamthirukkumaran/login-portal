"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface TeacherTableProps {
  teachers: Teacher[];
  refresh: () => Promise<void>;
}

export default function TeacherTable({ teachers, refresh }: TeacherTableProps) {
  const deleteTeacher = async (id: string) => {
    const res = await fetch(`/api/teachers/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Teacher deleted");
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
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {teachers.map((t) => (
              <tr key={t._id} className="border-b">
                <td className="p-3">{t.name}</td>
                <td className="p-3">{t.email}</td>
                <td className="p-3 text-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTeacher(t._id)}
                    className="cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td colSpan={3} className="p-5 text-center text-gray-500">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
