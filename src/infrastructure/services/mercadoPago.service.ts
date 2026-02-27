
export interface MercadoPagoItem {
  id: string; 
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  description?: string;
  category_id: string;
}

export interface MercadoPagoPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
}

export class MercadoPagoService {
  private readonly accessToken: string;
  private readonly baseUrl: string = 'https://api.mercadopago.com';

  constructor() {
    this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;
    if (!this.accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado');
    }
  }

  async createPreference(
    items: MercadoPagoItem[],
    payer: any,
    backUrls: any,
    externalReference: string
  ): Promise<MercadoPagoPreferenceResponse> {
    const payload = {
      items,
      payer,
      back_urls: backUrls,
      auto_return: "approved",
      notification_url: `${process.env.BACKEND_URL}/webhooks/mercadopago`,
      external_reference: externalReference,
      statement_descriptor: process.env.MERCADOPAGO_STATEMENT_DESCRIPTOR || "MINIMALIST",
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-Idempotency-Key': externalReference
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(
        `MercadoPago Error (${response.status}): ${data.message || JSON.stringify(data)}`
      );
    }

    return data;
  }

  async getPaymentDetails(paymentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error consultando pago: ${response.statusText}`);
    }

    return response.json();
  }
}