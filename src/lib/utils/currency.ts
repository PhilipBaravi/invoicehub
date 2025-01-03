export interface ExchangeRates {
  [key: string]: number;
}

export interface ExchangeRateResponse {
  success: boolean;
  message: string;
  code: number;
  data: ExchangeRates;
}
