"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface SubjectInput {
  subject: string;
  marks: number;
}

interface SemesterData {
  semester: number;
  subjects: SubjectInput[];
}

export default function SemesterMarksTable({ studentId }: { studentId: string }) {
  const emptySubjects = Array(6).fill({ subject: "", marks: 0 });

  const [rows, setRows] = useState<SemesterData[]>([]);
  const [currentRow, setCurrentRow] = useState<SemesterData>({
    semester: 1,
    subjects: emptySubjects,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const updatedSubjects = [...currentRow.subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: field === "marks" ? Number(value) : value,
    };
    setCurrentRow({ ...currentRow, subjects: updatedSubjects });
  };

  const handleAddOrSave = async () => {
    if (!currentRow.semester) return toast.error("Enter semester number");

    const filled = currentRow.subjects.filter((s) => s.subject && s.marks > 0);
    if (filled.length === 0)
      return toast.error("Please fill at least one subject");

    // SAVE or UPDATE row in UI
    let updatedList = [...rows];

    if (editingIndex !== null) {
      updatedList[editingIndex] = currentRow;
      toast.success("Marks updated successfully");
    } else {
      updatedList.push(currentRow);
      toast.success("Marks added successfully");
    }

    setRows(updatedList);
    setEditingIndex(null);

    // send to backend
    await saveToDatabase(currentRow);

    setCurrentRow({
      semester: currentRow.semester + 1,
      subjects: emptySubjects,
    });
  };

  const saveToDatabase = async (payload: SemesterData) => {
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks: payload, // same structure as model
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleEdit = (rowIndex: number) => {
    setEditingIndex(rowIndex);
    setCurrentRow(rows[rowIndex]);
  };

  const handleDelete = (rowIndex: number) => {
    setRows(rows.filter((_, idx) => idx !== rowIndex));
    toast.success("Row removed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          Semester Marks
          <Button variant="default" size="sm" onClick={handleAddOrSave}>
            {editingIndex !== null ? (
              <Save size={16} />
            ) : (
              <Plus size={16} />
            )}
            {editingIndex !== null ? " Save" : " Add"}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 font-semibold text-center">
              <th className="p-2 border">SEM</th>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <th key={i} className="p-2 border">SUBJ</th>
                ))}
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Editable Row */}
            <tr className="bg-blue-50">
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={currentRow.semester}
                  className="w-full text-center border"
                  onChange={(e) =>
                    setCurrentRow({
                      ...currentRow,
                      semester: Number(e.target.value),
                    })
                  }
                />
              </td>

              {currentRow.subjects.map((subj, index) => (
                <td key={index} className="border p-2 text-center">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full mb-1 border text-center"
                    onChange={(e) =>
                      handleSubjectChange(index, "subject", e.target.value)
                    }
                    value={subj.subject}
                  />
                  <input
                    type="number"
                    placeholder="Marks"
                    className="w-full border text-center"
                    onChange={(e) =>
                      handleSubjectChange(index, "marks", e.target.value)
                    }
                    value={subj.marks}
                  />
                </td>
              ))}

              <td className="border p-2 text-center">
                <Button onClick={handleAddOrSave} className="w-full">
                  {editingIndex !== null ? <Save size={16} /> : <Plus size={16} />}
                </Button>
              </td>
            </tr>

            {/* Saved rows */}
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                <td className="border p-2 text-center font-semibold">
                  Sem {row.semester}
                </td>

                {row.subjects.map((s, i) => (
                  <td key={i} className="border p-2 text-center">
                    {s.subject} <br />
                    <span className="text-gray-600">{s.marks}/100</span>
                  </td>
                ))}

                <td className="border p-2 flex gap-2 justify-center">
                  <button onClick={() => handleEdit(rowIdx)}>
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(rowIdx)}>
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
