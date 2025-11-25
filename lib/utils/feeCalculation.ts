/**
 * Calculate discounted course fee based on 12th marks
 * Base fee: ₹10,00,000
 * Rules:
 * - Above 580: 50% discount
 * - Above 550: 20% discount
 * - Below 550: No discount
 */

export const BASE_COURSE_FEE = 1000000; // ₹10,00,000

export function calculateDiscountedFee(mark12: number | undefined): {
  originalFee: number;
  discount: number;
  discountPercentage: number;
  finalFee: number;
} {
  const originalFee = BASE_COURSE_FEE;
  let discountPercentage = 0;

  if (mark12 && mark12 > 580) {
    discountPercentage = 50;
  } else if (mark12 && mark12 > 550) {
    discountPercentage = 20;
  }

  const discount = (originalFee * discountPercentage) / 100;
  const finalFee = originalFee - discount;

  return {
    originalFee,
    discount,
    discountPercentage,
    finalFee,
  };
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
