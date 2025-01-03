import { ExchangeRates } from "./currency";

export class CurrencyConverter {
  private rates: ExchangeRates;

  constructor(rates: ExchangeRates) {
    this.rates = rates;
  }

  /**
   * Convert amount from one currency to another
   */
  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = this.rates[fromCurrency];
    const toRate = this.rates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error(
        `Invalid currency conversion: ${fromCurrency} to ${toCurrency}`
      );
    }

    // Convert to target currency
    const converted = amount * (toRate / fromRate);

    // Round to 2 decimal places
    return Math.round(converted * 100) / 100;
  }

  /**
   * Convert amount back to its original currency
   */
  revert(
    amount: number,
    fromCurrency: string,
    originalCurrency: string
  ): number {
    return this.convert(amount, fromCurrency, originalCurrency);
  }
}
