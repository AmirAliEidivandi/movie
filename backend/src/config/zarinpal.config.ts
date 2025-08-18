import { registerAs } from '@nestjs/config';

export default registerAs('zarinpal', () => ({
  merchantId: process.env.ZARINPAL_MERCHANT_ID,
  sandbox: process.env.ZARINPAL_SANDBOX === 'true' || true,
  callbackBaseUrl:
    process.env.ZARINPAL_CALLBACK_BASE_URL || 'http://localhost:3000',
}));
