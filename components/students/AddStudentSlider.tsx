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

interface AddStudentSliderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => Promise<void>;
}

export default function AddStudentSlider({
  open,
  setOpen,
  refresh,
}: AddStudentSliderProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    city: "",
    dob: "",
    group12: "",
    mark12: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Student added successfully");
        setOpen(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          gender: "",
          city: "",
          dob: "",
          group12: "",
          mark12: "",
        });
        refresh();
      } else {
        toast.error(data.message || "Failed to add student");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="
          w-full sm:max-w-md 
          bg-white dark:bg-neutral-900 
          shadow-2xl rounded-l-2xl 
          overflow-y-auto 
          p-8 
          transition-all duration-300 ease-in-out
        "
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Add New Student</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Fill in the student details below
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Student name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md bg-transparent focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <Input name="dob" type="date" value={formData.dob} onChange={handleChange} />
          </div>

          <h3 className="text-lg font-semibold border-b pb-2">Academics</h3>

          <div>
            <label className="block text-sm font-medium mb-1">12th Group</label>
            <select
              name="group12"
              value={formData.group12}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md bg-transparent focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="">Select group</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">12th Marks</label>
            <Input
              name="mark12"
              type="number"
              value={formData.mark12}
              onChange={handleChange}
              placeholder="Marks obtained"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Student"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
