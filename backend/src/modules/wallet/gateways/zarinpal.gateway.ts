import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface ZarinpalRequestPaymentResponse {
  data: {
    code: number;
    message: string;
    authority: string;
    fee_type?: string;
    fee?: number;
  };
}

interface ZarinpalVerifyPaymentResponse {
  data: {
    code: number;
    message: string;
    ref_id: number;
    card_pan?: string;
    fee_type?: string;
    fee?: number;
  };
}

@Injectable()
export class ZarinpalGateway {
  private readonly baseUrl: string;
  private readonly merchantId: string;
  private readonly callbackBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const sandbox = this.configService.get<boolean>('zarinpal.sandbox');
    this.baseUrl = sandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment'
      : 'https://api.zarinpal.com/pg/v4/payment';
    this.merchantId = this.configService.get<string>('zarinpal.merchantId');
    this.callbackBaseUrl = this.configService.get<string>(
      'zarinpal.callbackBaseUrl',
    );
  }

  async requestPayment(
    amount: number,
    description: string,
    callbackPath: string,
  ) {
    const callback_url = `${this.callbackBaseUrl}${callbackPath}`;
    const result = await axios.post<ZarinpalRequestPaymentResponse>(
      `${this.baseUrl}/request.json`,
      {
        merchant_id: this.merchantId,
        amount,
        description,
        callback_url,
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return result.data;
  }

  async verifyPayment(authority: string, amount: number) {
    const result = await axios.post<ZarinpalVerifyPaymentResponse>(
      `${this.baseUrl}/verify.json`,
      {
        merchant_id: this.merchantId,
        amount,
        authority,
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return result.data;
  }

  getStartPayUrl(authority: string): string {
    const sandbox = this.configService.get<boolean>('zarinpal.sandbox');
    const host = sandbox
      ? 'https://sandbox.zarinpal.com/pg/StartPay'
      : 'https://www.zarinpal.com/pg/StartPay';
    return `${host}/${authority}`;
  }
}
