// src/domain/entities/Payment.ts
export interface PaymentRequest {
  externalReference: string;
  description: string;
  amount: number;
  currency: string;
  payer: {
    email: string;
    name: string;
    surname: string;
  };
}
