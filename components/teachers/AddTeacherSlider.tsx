"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: () => void;
}

export default function AddTeacherSlider({ open, setOpen, refresh }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitTeacher = async () => {
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    const res = await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Teacher added successfully!");
      setOpen(false);
      refresh();
      setName("");
      setEmail("");
      setPassword("");
    } else {
      toast.error(data.message || "Failed to add teacher");
    }

    setLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[400px] p-6">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full cursor-pointer disabled:cursor-not-allowed" onClick={submitTeacher} disabled={loading}>
            {loading ? "Adding..." : "Add Teacher"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
