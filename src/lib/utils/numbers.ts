// Utility functions for number handling

/**
 * Rounds a number to a specified number of decimal places
 * Uses Math.round to avoid floating point precision issues
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Formats a number as currency string without using toFixed
 * Ensures proper decimal places and handles edge cases
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  const rounded = roundToDecimals(value, decimals);
  const [whole, decimal = ""] = rounded.toString().split(".");
  const paddedDecimal = decimal.padEnd(decimals, "0");
  return `${whole}.${paddedDecimal}`;
}
