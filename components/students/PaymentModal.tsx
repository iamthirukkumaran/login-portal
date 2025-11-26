"use client";

import { X, CreditCard, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/feeCalculation";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  student: {
    _id: string;
    name: string;
    customFee?: number;
    totalPaid?: number;
  };
  onPaymentSuccess: () => void;
  userName?: string;
}

export default function PaymentModal({
  open,
  setOpen,
  student,
  onPaymentSuccess,
  userName = "Admin",
}: PaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Manual");
  const [remarks, setRemarks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const fullFees = student.customFee || 1000000;
  const totalPaid = student.totalPaid || 0;
  const remainingBalance = Math.max(0, fullFees - totalPaid);

  const handleClose = () => {
    setOpen(false);
    setPaymentAmount("");
    setPaymentMethod("Manual");
    setRemarks("");
  };

  const handleSubmitPayment = async () => {
    const amount = Number(paymentAmount);

    if (!paymentAmount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (amount > remainingBalance) {
      toast.error(
        `Payment amount cannot exceed remaining balance of ${formatCurrency(remainingBalance)}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/students/${student._id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          paymentMethod,
          remarks: remarks || undefined,
          recordedBy: userName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Payment of ${formatCurrency(amount)} recorded successfully!`);
        handleClose();
        onPaymentSuccess();
      } else {
        toast.error(data.message || "Failed to record payment");
      }
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Error recording payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 max-w-sm w-full mx-4 border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Student Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">Student</p>
            <p className="text-lg font-bold text-blue-900">{student.name}</p>
          </div>

          {/* Fee Summary */}
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Full Fees:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(fullFees)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Already Paid:</span>
              <span className="font-semibold text-green-700">
                {formatCurrency(totalPaid)}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between text-sm font-bold">
              <span className="text-gray-900">Remaining:</span>
              <span className="text-orange-700">
                {formatCurrency(remainingBalance)}
              </span>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-600 font-semibold">
                ₹
              </span>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="100"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {paymentAmount && !isNaN(Number(paymentAmount)) && (
              <p className="text-xs text-gray-600">
                {Number(paymentAmount) > remainingBalance ? (
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Exceeds remaining balance
                  </span>
                ) : (
                  <span className="text-green-600">
                    ✓ Valid amount
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Manual">Manual Entry</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes about this payment..."
              rows={2}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500">{remarks.length}/100</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleSubmitPayment}
            disabled={
              isSubmitting ||
              !paymentAmount ||
              isNaN(Number(paymentAmount)) ||
              Number(paymentAmount) <= 0 ||
              Number(paymentAmount) > remainingBalance
            }
            className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isSubmitting ? "Processing..." : "Record Payment"}
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-gray-300 cursor-pointer"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
