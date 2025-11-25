"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface AddSemesterMarksProps {
  studentId: string;
  onClose: () => void;
}

export default function AddSemesterMarksSlider({
  studentId,
  onClose,
}: AddSemesterMarksProps) {
  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([
    { subject: "", marks: "" },
    { subject: "", marks: "" },
    { subject: "", marks: "" },
    { subject: "", marks: "" },
    { subject: "", marks: "" },
    { subject: "", marks: "" },
  ]);

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = {
      ...newSubjects[index],
      [field]: field === "marks" ? Number(value) : value,
    };
    setSubjects(newSubjects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!semester) {
      toast.error("Please select a semester");
      setLoading(false);
      return;
    }

    const filledSubjects = subjects.filter((s) => s.subject && s.marks);
    if (filledSubjects.length === 0) {
      toast.error("Please add at least one subject with marks");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks: {
            semester: parseInt(semester),
            subjects: filledSubjects.map(s => ({ subject: s.subject, marks: Number(s.marks) })),
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Semester marks added successfully");
        onClose();
        setSemester("");
        setSubjects([
          { subject: "", marks: "" },
          { subject: "", marks: "" },
          { subject: "", marks: "" },
          { subject: "", marks: "" },
          { subject: "", marks: "" },
          { subject: "", marks: "" },
        ]);
      } else {
        toast.error(data.message || "Failed to add marks");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={true} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Semester Marks</SheetTitle>
          <SheetDescription>Enter subjects and marks for the semester</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Subjects & Marks</label>
            {subjects.map((subject, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Subject name"
                  value={subject.subject}
                  onChange={(e) =>
                    handleSubjectChange(index, "subject", e.target.value)
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Marks"
                  max="100"
                  value={subject.marks}
                  onChange={(e) =>
                    handleSubjectChange(index, "marks", e.target.value)
                  }
                  className="w-20"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white"
            >
              {loading ? "Adding..." : "Add Marks"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
