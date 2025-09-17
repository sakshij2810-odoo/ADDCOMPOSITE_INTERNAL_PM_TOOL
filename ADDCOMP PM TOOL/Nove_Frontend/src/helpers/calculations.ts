/* eslint-disable prefer-const */

export const isNotNull = (value: string | number | null | undefined) => {
  return Number(value) || 0;
};

export const calculateDiscount = (amount: number, tax: number) => {
  return (amount * tax) / 100;
};

export const calculateDiscountV2 = (
  amount: string | number | null | undefined,
  tax: string | number | null | undefined
) => {
  let discount = (isNotNull(amount) * isNotNull(tax)) / 100;
  let remainingAmount = isNotNull(amount) - discount;
  return { discount, remainingAmount };
};

export const calculatePercentage = (
  amount: string | number | null | undefined,
  totalAmount: string | number | null | undefined
) => {
  const validAmount = amount != null ? Number(amount) : 0;
  const validTotalAmount = totalAmount != null ? Number(totalAmount) : 0;

  // If totalAmount is zero, avoid division by zero and return 0
  if (validTotalAmount === 0) {
    return 0;
  }
  return (100 - (isNotNull(validAmount) / isNotNull(totalAmount)) * 100).toPrecision(10);
};

export const calculateTax = (amount: number, tax: number) => {
  return (amount * tax) / 100;
};

export const roundoffToString = (value: number, decimalPlaces = 2) => {
  return value.toFixed(decimalPlaces);
};
export const roundoffToNumber = (value: number, decimalPlaces = 2) => {
  return Number(roundoffToString(value, decimalPlaces));
};

export const calculateTaxV2 = (
  amount: string | number | null | undefined,
  tax: string | number | null | undefined
): number => {
  return roundoffToNumber((isNotNull(amount) * isNotNull(tax)) / 100);
};

const processDiscountOrCharge = (
  currentAmount: number,
  percentage: any,
  fixedValue: any,
  isAddition: boolean
) => {
  const multiplier = isAddition ? 1 : -1;

  if (isNotNull(percentage) > 0) {
    const value = calculateDiscount(currentAmount, isNotNull(percentage));
    return {
      value,
      amount: currentAmount + value * multiplier,
    };
  }

  const value = isNotNull(fixedValue);
  return {
    value,
    amount: currentAmount + value * multiplier,
  };
};

const calculateTaxAmount = (amount: number, taxPercentage: any, fixedTaxValue: any) => {
  if (isNotNull(taxPercentage) > 0) {
    return calculateTaxV2(amount, taxPercentage);
  }
  return isNotNull(fixedTaxValue);
};

const calculateGST = (
  taxableValue: number,
  isTypeCGST: boolean,
  igst: any,
  cgst: any,
  sgst: any
) => {
  if (isTypeCGST) {
    const totalCSGST = isNotNull(cgst) + isNotNull(sgst);
    return calculateTaxV2(taxableValue, totalCSGST);
  }
  return calculateTaxV2(taxableValue, igst);
};

export function displayPriceFormat(value: string | number | null) {
  return isNotNull(value)
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}
