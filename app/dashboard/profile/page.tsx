"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Edit3, 
  Trash2,
  User,
  BookOpen,
  Award,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Shield,
  CreditCard,
  History
} from "lucide-react";
import { calculateDiscountedFee, formatCurrency } from "@/lib/utils/feeCalculation";
import { toast } from "sonner";
import PaymentHistoryModal from "@/components/students/PaymentHistoryModal";
import PaymentModal from "@/components/students/PaymentModal";

// Subjects configuration - FIXED VERSION
const semesterSubjects: { [key: number]: string[] } = {
  1: ["Mathematics I","Engineering Physics","Engineering Chemistry","Problem Solving & Programming Using C","Basics of Electrical & Electronics Engineering","Engineering Graphics"],
  2: ["Mathematics II","Data Structures & Algorithms","Digital Logic & Computer Organization","Object Oriented Programming with C++","Environmental Science","Communication Skills"],
  3: ["Discrete Mathematics","Operating Systems","Database Management Systems","Computer Networks","Data Structures Laboratory","OOP Laboratory"],
  4: ["Theory of Computation","Design & Analysis of Algorithms","Microprocessors & Embedded Systems","Software Engineering","Computer Networks Laboratory","DBMS Laboratory"],
  5: ["Artificial Intelligence","Machine Learning","Web Technology","Cloud Computing","Computer Graphics","Professional Ethics"],
  6: ["Compiler Design","Big Data Analytics","Distributed Systems","Network Security","Mobile Application Development","Open Elective I"],
  7: ["Deep Learning","Internet of Things","DevOps","Human Computer Interaction","Open Elective II","Project Phase I"],
  8: ["Cyber Security","BlockChain Technology","Advanced Algorithms","Elective III","Industrial Internship","Project Phase II"],
};

// Get subjects for semester - SIMPLIFIED AND WORKING VERSION
const getSubjectsForSemester = (semester: number): string[] => {
  return semesterSubjects[semester] || ["Physics", "Chemistry", "Math", "Biology", "History", "Social"];
};

interface SemesterMark {
  semester: number;
  subjects: Array<{
    subjectName: string;
    mark: number;
  }>;
}

interface Student {
  _id: string;
  studentId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  city?: string;
  dob?: string;
  group12?: string;
  mark12?: number;
  marks?: SemesterMark[];
  customFee?: number;
  totalPaid?: number;
  paymentHistory?: Array<{
    amount: number;
    paidAt: string;
    paymentMethod: string;
    remarks?: string;
    recordedBy?: string;
  }>;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  
  const viewingStudentId = searchParams.get("id");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  
  // Edit mode states - using slider
  const [isEditSliderOpen, setIsEditSliderOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Student> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fee editing states
  const [isEditingFees, setIsEditingFees] = useState(false);
  const [editingBaseFee, setEditingBaseFee] = useState<string>("");
  const [isEditingFeesSaving, setIsEditingFeesSaving] = useState(false);
  
  // Payment states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  
  // Semester marks states - inline table mode
  const [activeFormSemester, setActiveFormSemester] = useState<number | null>(null);
  const [formStates, setFormStates] = useState<{
    [semester: number]: {
      subjects: Array<{ subject: string; marks: string }>;
      loading: boolean;
    };
  }>({});
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editingRowData, setEditingRowData] = useState<Array<{ subject: string; marks: number }> | null>(null);

  // Slider state for demo purposes (you can integrate this with actual data)
  const [sliderValue, setSliderValue] = useState([50]);

  useEffect(() => {
    if (!isLoading && user) {
      const targetStudentId = viewingStudentId || user.id;
      
      if (viewingStudentId && user.role === "student" && user.id !== viewingStudentId) {
        setIsAuthorized(false);
        setLoading(false);
        return; 
      }

      if (user.role === "student" && viewingStudentId) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      fetchStudentProfile(targetStudentId);
    }
  }, [user, isLoading, viewingStudentId]);

  const fetchStudentProfile = async (studentId: string) => {
    try {
      setError(null);
      
      let endpoint = "/api/student";
      if (studentId && studentId !== user?.id) {
        endpoint = `/api/students/${studentId}`;
      }

      const res = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();
      
      if (!res.ok || !data.success) {
        if (endpoint === "/api/student" && user?.email) {
          const fallbackRes = await fetch(`/api/students/email/${user.email}`, {
            method: "GET",
            cache: "no-store",
          });
          
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            if (fallbackData.success && fallbackData.student) {
              setStudent(fallbackData.student);
              setLoading(false);
              return;
            }
          }
        }
        
        setError("Profile not found");
        setStudent(null);
      } else {
        setStudent(data.student);
      }
    } catch (error) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditSliderOpen(true);
    setEditData({ ...student });
  };

  const handleSaveProfile = async () => {
    if (!editData || !student) return;
    
    setIsSaving(true);
    try {
      const endpoint = `/api/students/${student._id}`;
      const profileData = {
        name: editData.name,
        phone: editData.phone,
        gender: editData.gender,
        city: editData.city,
        dob: editData.dob,
        // Include slider value if you want to save it
        customSliderValue: sliderValue[0],
      };
      
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setStudent(data.student);
        setIsEditSliderOpen(false);
        setEditData(null);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditSliderOpen(false);
    setEditData(null);
  };

  const handleEditFees = () => {
    setEditingBaseFee((student?.customFee || feeInfo.originalFee).toString());
    setIsEditingFees(true);
  };

  const handleSaveFees = async () => {
    if (!student || !editingBaseFee) return;

    const baseFee = Number(editingBaseFee);
    if (isNaN(baseFee) || baseFee <= 0) {
      toast.error("Please enter a valid fee amount");
      return;
    }

    setIsEditingFeesSaving(true);
    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customFee: baseFee }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStudent(data.student);
        setIsEditingFees(false);
        setEditingBaseFee("");
        toast.success("Fee updated successfully");
      } else {
        toast.error(data.message || "Failed to update fee");
      }
    } catch (error) {
      console.error("Error saving fee:", error);
      toast.error("Error saving fee");
    } finally {
      setIsEditingFeesSaving(false);
    }
  };

  const handleCancelFeeEdit = () => {
    setIsEditingFees(false);
    setEditingBaseFee("");
  };

  const handlePaymentSuccess = () => {
    fetchStudentProfile(student?._id || user?.id || "");
  };

  const initializeFormForSemester = (semester: number) => {
    if (!formStates[semester]) {
      const semesterSubjects = getSubjectsForSemester(semester);
      setFormStates({
        ...formStates,
        [semester]: {
          subjects: semesterSubjects.map((subj: string) => ({ subject: subj, marks: "" })),
          loading: false,
        },
      });
    }
  };

  const handleAddMarksClick = (semester: number) => {
    if (student?.marks?.some(m => m.semester === semester)) {
      toast.error("This semester already has marks. Please edit or delete first.");
      return;
    }
    initializeFormForSemester(semester);
    setActiveFormSemester(semester);
  };

  const handleSubjectChangeInline = (semester: number, index: number, field: string, value: string) => {
    setFormStates({
      ...formStates,
      [semester]: {
        ...formStates[semester],
        subjects: formStates[semester].subjects.map((s, i) =>
          i === index ? { ...s, [field]: value } : s
        ),
      },
    });
  };

  const handleSaveMarksInline = async (semester: number) => {
    const formState = formStates[semester];
    if (!formState) {
      toast.error("Form not initialized");
      return;
    }

    const marksToSave = formState.subjects
      .filter(s => s.subject.trim() !== "")
      .map(s => ({
        subject: s.subject,
        marks: Number(s.marks) || 0,
      }));

    if (marksToSave.length === 0) {
      toast.error("Please enter marks for at least one subject");
      return;
    }

    if (marksToSave.some(m => m.marks < 0 || m.marks > 100)) {
      toast.error("All marks must be between 0 and 100");
      return;
    }

    if (!student) {
      toast.error("Student data not loaded");
      return;
    }

    setFormStates({
      ...formStates,
      [semester]: { ...formState, loading: true },
    });

    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks: {
            semester,
            subjects: marksToSave,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStudent(data.student);
        setActiveFormSemester(null);
        setFormStates({
          ...formStates,
          [semester]: {
            subjects: Array(6).fill(null).map(() => ({ subject: "", marks: "" })),
            loading: false,
          },
        });
        toast.success("Marks saved successfully");
        setTimeout(() => {
          const marksSection = document.querySelector('[data-marks-section]');
          if (marksSection) {
            marksSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 300);
      } else {
        toast.error(data.message || "Failed to save marks");
      }
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error("Error saving marks");
    } finally {
      setFormStates({
        ...formStates,
        [semester]: { ...formState, loading: false },
      });
    }
  };

  const handleEditMark = (semester: number, markData: Array<any>) => {
    const convertedData = markData.map(m => ({
      subject: m.subject || m.subjectName || "",
      marks: m.marks !== undefined ? m.marks : (m.mark || 0)
    }));
    setEditingRowId(semester);
    setEditingRowData([...convertedData]);
  };

  const handleSaveMark = async (semester: number) => {
    if (!editingRowData || !student) {
      toast.error("No data to save");
      return;
    }

    try {
      const updatedMarks = student.marks?.map(m =>
        m.semester === semester
          ? { semester, subjects: editingRowData }
          : m
      ) || [];

      const res = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marks: updatedMarks }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStudent(data.student);
        setEditingRowId(null);
        setEditingRowData(null);
        toast.success("Marks updated successfully");
      } else {
        toast.error(data.message || "Failed to update marks");
      }
    } catch (error) {
      console.error("Error updating marks:", error);
      toast.error("Error updating marks");
    }
  };

  const handleDeleteMark = async (semester: number) => {
    if (!student) {
      toast.error("Student data not loaded");
      return;
    }

    try {
      const updatedMarks = student.marks?.filter(m => m.semester !== semester) || [];

      const res = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marks: updatedMarks }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStudent(data.student);
        toast.success("Marks deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete marks");
      }
    } catch (error) {
      console.error("Error deleting marks:", error);
      toast.error("Error deleting marks");
    }
  };  

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-gray-300 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Access Denied</h3>
            <p className="text-gray-600 mb-6">
              You don't have permission to view this profile.
            </p>
            <Button onClick={() => router.back()} className="bg-gray-900 hover:bg-gray-800 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6 border-gray-300 hover:bg-white shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Card className="border-gray-300 shadow-lg">
            <CardContent className="pt-10 pb-10 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Profile Not Found</h3>
              <p className="text-gray-600 mb-6">{error || "The student profile could not be loaded."}</p>
              <Button onClick={() => router.push("/")} className="bg-gray-900 hover:bg-gray-800 cursor-pointer">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === student.userId;
  const canEdit = isOwnProfile || user?.role === "superadmin" || user?.role === "teacher";
  const feeInfo = calculateDiscountedFee(student.mark12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 hover:bg-white shadow-sm h-9 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {isOwnProfile ? "My Profile" : student.name.toUpperCase()}
                </h1>
              </div>
            </div>
          </div>
          
          {canEdit && (
            <Button 
              onClick={handleEditProfile}
              className="bg-gray-900 hover:bg-gray-800 h-9 shadow-sm cursor-pointer"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="xl:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <Card className="border border-gray-300 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5 text-gray-700" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField icon={<User className="h-4 w-4" />} label="Student ID" value={student.studentId} />
                  <InfoField icon={<User className="h-4 w-4" />} label="Full Name" value={student.name.toUpperCase()} />
                  <InfoField icon={<Mail className="h-4 w-4" />} label="Email" value={student.email} />
                  <InfoField icon={<Phone className="h-4 w-4" />} label="Phone" value={student.phone} />
                  <InfoField icon={<User className="h-4 w-4" />} label="Gender" value={student.gender} />
                  <InfoField icon={<MapPin className="h-4 w-4" />} label="City" value={student.city?.toUpperCase()} />
                  <InfoField icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={student.dob} />
                </div>
              </CardContent>
            </Card>

            {/* Semester Marks Section */}
            <Card className="border border-gray-300 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r from-gray-50 to-white flex flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Award className="h-5 w-5 text-gray-700" />
                  Semester Marks
                </CardTitle>
                {canEdit && (
                  <Button
                    onClick={() => {
                      let nextSemester = null;
                      for (let sem = 1; sem <= 8; sem++) {
                        if (!student.marks?.some(m => m.semester === sem)) {
                          nextSemester = sem;
                          break;
                        }
                      }
                      
                      if (nextSemester) {
                        initializeFormForSemester(nextSemester);
                        setActiveFormSemester(nextSemester);
                      } else {
                        toast.error("All semesters already have marks!");
                      }
                      setEditingRowId(null);
                    }}
                    className="bg-gray-800 hover:bg-gray-800 h-8 text-xs cursor-pointer"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Marks
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4" data-marks-section>
                  {/* Existing Marks */}
                  {student.marks && student.marks.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Saved Semester Marks</h3>
                      {student.marks.map((mark) => (
                        <div key={mark.semester} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-3 border-b border-gray-300">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                              <h3 className="font-bold text-gray-800">Semester {mark.semester}</h3>
                            </div>
                            {editingRowId === mark.semester ? (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveMark(mark.semester)}
                                  className="bg-gray-900 hover:bg-gray-800 h-7 text-xs cursor-pointer"
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingRowId(null);
                                    setEditingRowData(null);
                                  }}
                                  className="border-gray-300 h-7 text-xs cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                {canEdit && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditMark(mark.semester, mark.subjects)}
                                      className="border-gray-300 h-7 text-xs cursor-pointer"
                                    >
                                      <Edit3 className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteMark(mark.semester)}
                                      className="border-red-200 text-red-600 hover:bg-red-50 h-7 text-xs cursor-pointer"
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 6 Column Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 bg-white">
                            {mark.subjects && Array.isArray(mark.subjects) && mark.subjects.length > 0 ? (
                              (editingRowId === mark.semester && editingRowData ? editingRowData : mark.subjects).map((subject: any, sidx) => {
                                const subjectName = subject.subject || subject.subjectName || `Subject ${sidx + 1}`;
                                const markValue = subject.marks !== undefined ? subject.marks : (subject.mark !== undefined ? subject.mark : 0);

                                return (
                                  <div key={sidx} className="border-r border-b border-gray-300 last:border-r-0 hover:bg-blue-50 transition-colors">
                                    <div className="p-3 text-center min-h-24 flex flex-col justify-center">
                                      {editingRowId === mark.semester ? (
                                        <div className="space-y-1">
                                          <div className="text-xs font-semibold text-gray-700 mb-1 truncate">
                                            {subjectName}
                                          </div>
                                          <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={subject.marks !== undefined ? subject.marks : ""}
                                            onChange={(e) => {
                                              const updated = [...(editingRowData || [])];
                                              updated[sidx].marks = Number(e.target.value);
                                              setEditingRowData(updated);
                                            }}
                                            placeholder="0-100"
                                            className="w-full px-1 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 text-center font-semibold"
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center justify-center">
                                          <p className="font-bold text-gray-700 text-xs mb-1 leading-tight truncate w-full">
                                            {subjectName}
                                          </p>
                                          <p className="text-xl font-bold text-blue-600">
                                            {markValue}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-0.5"></p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="col-span-6 p-4 text-center text-gray-500 text-sm">
                                No marks recorded for this semester
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Form for Adding New Marks */}
                  {activeFormSemester !== null && canEdit && (
                    <div className="p-4 border-2 border-green-300 rounded-lg bg-green-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">
                          Add Marks for Semester {activeFormSemester}
                        </h3>
                        <button
                          onClick={() => setActiveFormSemester(null)}
                          className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-white p-3 rounded border border-gray-200">
                          {formStates[activeFormSemester]?.subjects && formStates[activeFormSemester].subjects.length > 0 ? (
                            formStates[activeFormSemester].subjects.map((subject, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div className="text-xs font-bold text-gray-800 text-center mb-2 w-full truncate">
                                  {subject.subject}
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={subject.marks}
                                  onChange={(e) =>
                                    handleSubjectChangeInline(activeFormSemester, idx, "marks", e.target.value)
                                  }
                                  placeholder="0"
                                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent text-center font-semibold text-sm"
                                />
                                <div className="text-xs text-gray-500 mt-0.5">/100</div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-6 text-center py-3 text-gray-500 text-sm">
                              No subjects configured for this semester
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSaveMarksInline(activeFormSemester)}
                          disabled={formStates[activeFormSemester]?.loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-1 h-8 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          {formStates[activeFormSemester]?.loading ? "Saving..." : "Save Marks"}
                        </Button>
                        <Button
                          onClick={() => {
                            setActiveFormSemester(null);
                          }}
                          variant="outline"
                          className="flex-1 border-gray-300 text-sm py-1 h-8 cursor-pointer"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {(!student.marks || student.marks.length === 0) && activeFormSemester === null && (
                    <div className="text-center py-8">
                      <Award className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        No semester marks recorded yet. {canEdit && "Click 'Add Marks' to get started."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Academic & Fees Info */}
          <div className="space-y-6">
            {/* Academic Information */}
            <Card className="border border-gray-300 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-3 bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BookOpen className="h-4 w-4 text-gray-700" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {student.group12 && (
                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-gray-600 font-medium">12th Group</p>
                      <p className="text-base font-semibold text-gray-900">{student.group12}</p>
                    </div>
                  )}
                  
                  {student.mark12 && (
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-xs text-green-700 font-medium">12th Marks</p>
                      <p className="text-xl font-bold text-green-900">{student.mark12}/600</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fees Information */}
            <Card className="border border-gray-300 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <DollarSign className="h-4 w-4 text-gray-700" />
                    Fees Management
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {canEdit && (
                      <>
                        <Button
                          onClick={handleEditFees}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-gray-300 cursor-pointer whitespace-nowrap"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => setIsPaymentModalOpen(true)}
                          size="sm"
                          className="h-7 text-xs bg-green-600 hover:bg-green-700 cursor-pointer whitespace-nowrap"
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          Pay
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => setIsPaymentHistoryOpen(true)}
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-gray-300 cursor-pointer whitespace-nowrap"
                    >
                      <History className="h-3 w-3 mr-1" />
                      Summary
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Full Fees (Already includes discount) */}
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-700 text-sm font-medium">Full Fees:</span>
                    <span className="font-bold text-gray-900 text-base">{formatCurrency(student?.customFee || feeInfo.originalFee)}</span>
                  </div>

                  {/* Total Paid */}
                  <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-700 text-sm font-medium">Total Paid:</span>
                    <span className="font-bold text-green-900 text-base">{formatCurrency(student?.totalPaid || 0)}</span>
                  </div>

                  {/* Remaining Balance */}
                  {(() => {
                    const fullFee = student?.customFee || feeInfo.originalFee;
                    const totalPaid = student?.totalPaid || 0;
                    const remaining = Math.max(0, fullFee - totalPaid);
                    const isFullyPaid = remaining === 0;

                    return (
                      <div
                        className={`flex justify-between items-center py-2 px-3 rounded-lg border-2 ${
                          isFullyPaid
                            ? "bg-green-100 border-green-300"
                            : "bg-orange-50 border-orange-300"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            isFullyPaid
                              ? "text-green-700"
                              : "text-orange-700"
                          }`}
                        >
                          {isFullyPaid ? "✓ Fully Paid" : "Remaining Balance:"}
                        </span>
                        <span
                          className={`font-bold text-base ${
                            isFullyPaid
                              ? "text-green-900"
                              : "text-orange-900"
                          }`}
                        >
                          {formatCurrency(remaining)}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Payment Progress Bar */}
                  {(() => {
                    const fullFee = student?.customFee || feeInfo.originalFee;
                    const totalPaid = student?.totalPaid || 0;
                    const progress = Math.min((totalPaid / fullFee) * 100, 100);

                    return (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Payment Progress</span>
                          <span className="font-semibold text-gray-900">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Admin Footer */}
            {!isOwnProfile && user?.role !== "student" && (
              <Card className="border-blue-200 bg-blue-50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      <span className="font-semibold">Admin View:</span> You are viewing {student.name}'s profile. 
                      Use the edit buttons to modify student details or semester marks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Fees Modal */}
      {isEditingFees && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
            onClick={handleCancelFeeEdit}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-sm w-full mx-4 border border-gray-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Edit Fees</h2>
              </div>
              <button
                onClick={handleCancelFeeEdit}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Fees Amount (After Discount)</label>
                  <input
                    type="number"
                    value={editingBaseFee}
                    onChange={(e) => setEditingBaseFee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full fees amount"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the final fee amount after applying any discounts</p>
                </div>

                {editingBaseFee && !isNaN(Number(editingBaseFee)) && Number(editingBaseFee) > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900">
                      ₹{Number(editingBaseFee).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                onClick={handleSaveFees}
                disabled={isEditingFeesSaving || !editingBaseFee || isNaN(Number(editingBaseFee)) || Number(editingBaseFee) <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditingFeesSaving ? "Saving..." : "Save Fees"}
              </Button>
              <Button
                onClick={handleCancelFeeEdit}
                variant="outline"
                className="flex-1 border-gray-300 cursor-pointer"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Edit Profile Slider */}
      <Sheet open={isEditSliderOpen} onOpenChange={setIsEditSliderOpen}>
  <SheetContent className="sm:max-w-md flex flex-col p-0">
    <SheetHeader className="px-6 pt-6 pb-4 border-b">
      <SheetTitle className="flex items-center gap-2">
        <Edit2 className="h-5 w-5" />
        Edit Profile
      </SheetTitle>
      <SheetDescription>
        Update your personal information here. Click save when you're done.
      </SheetDescription>
    </SheetHeader>

    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="grid gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={editData?.name || ""}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={editData?.email || ""}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={editData?.phone || ""}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <select
            value={editData?.gender || ""}
            onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={editData?.city || ""}
            onChange={(e) => setEditData({ ...editData, city: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={editData?.dob || ""}
            onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <SheetFooter className="px-6 py-6 border-t bg-gray-50 mt-auto">
      <div className="flex gap-3 w-full">
        <Button 
          onClick={handleSaveProfile} 
          disabled={isSaving} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <SheetClose asChild>
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 cursor-pointer"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </SheetClose>
      </div>
    </SheetFooter>
  </SheetContent>
</Sheet>

    {/* Payment Modal */}
    <PaymentModal
      open={isPaymentModalOpen}
      setOpen={setIsPaymentModalOpen}
      student={student!}
      onPaymentSuccess={handlePaymentSuccess}
      userName={user?.name || "Admin"}
    />

    {/* Payment History Modal */}
    <PaymentHistoryModal
      open={isPaymentHistoryOpen}
      setOpen={setIsPaymentHistoryOpen}
      student={student!}
      discountPercentage={feeInfo.discountPercentage}
    />
    </div>
  );
}

// Helper Components
const InfoField = ({ 
  icon, 
  label, 
  value 
}: { 
  icon?: React.ReactNode;
  label: string; 
  value?: string;
}) => (
  <div className="flex items-start gap-2 py-1">
    <div className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value || "Not specified"}</p>
    </div>
  </div>
);