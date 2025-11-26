"use client";

import { X, AlertCircle, CheckCircle2, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/feeCalculation";

interface PaymentRecord {
  amount: number;
  paidAt: string;
  paymentMethod: string;
  remarks?: string;
  recordedBy?: string;
}

interface PaymentHistoryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  student: {
    name: string;
    customFee?: number;
    totalPaid?: number;
    paymentHistory?: PaymentRecord[];
  };
  discountPercentage?: number;
}

export default function PaymentHistoryModal({
  open,
  setOpen,
  student,
  discountPercentage = 0,
}: PaymentHistoryModalProps) {
  if (!open) return null;

  const fullFees = student.customFee || 1000000;
  const totalPaid = student.totalPaid || 0;
  const remainingBalance = Math.max(0, fullFees - totalPaid);
  const isFullyPaid = remainingBalance === 0;
  const paymentHistory = student.paymentHistory || [];

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 max-w-2xl w-full mx-4 border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Student Name</p>
            <p className="text-lg font-bold text-gray-900">{student.name}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Fees Card */}
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Full Fees (After Discount)</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(fullFees)}
                  </p>
                  {discountPercentage > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      {discountPercentage}% discount applied
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amount Paid Card */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-2">Total Paid</p>
                  <p className="text-3xl font-bold text-green-900">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Remaining Balance & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Remaining Balance */}
            <Card
              className={
                isFullyPaid
                  ? "border-green-200 bg-green-50"
                  : "border-orange-200 bg-orange-50"
              }
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">
                    {isFullyPaid ? (
                      <span className="text-green-700">Balance Cleared</span>
                    ) : (
                      <span className="text-orange-700">Remaining Balance</span>
                    )}
                  </p>
                  <p className="text-3xl font-bold">
                    {isFullyPaid ? (
                      <span className="text-green-900">₹0</span>
                    ) : (
                      <span className="text-orange-900">
                        {formatCurrency(remainingBalance)}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {isFullyPaid ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-orange-600" />
                    )}
                  </div>
                  <p className="text-sm font-bold">
                    {isFullyPaid ? (
                      <span className="text-green-700">✓ Full Fees Paid</span>
                    ) : (
                      <span className="text-orange-700">
                        {Math.round((totalPaid / fullFees) * 100)}% Paid
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment History Table */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Transaction History
            </h3>

            {paymentHistory.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <History className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No payments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.paidAt).toLocaleDateString()}{" "}
                            {new Date(payment.paidAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">
                        {payment.paymentMethod}
                      </p>
                      {payment.recordedBy && (
                        <p className="text-xs text-gray-500">
                          By: {payment.recordedBy}
                        </p>
                      )}
                      {payment.remarks && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          "{payment.remarks}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {paymentHistory.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Payment Progress
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {Math.round((totalPaid / fullFees) * 100)}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFullyPaid ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min((totalPaid / fullFees) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleClose}
            className="w-full bg-gray-900 hover:bg-gray-800 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
