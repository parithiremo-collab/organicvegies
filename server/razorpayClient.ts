import crypto from 'crypto';

// Razorpay client for UPI payment processing
export class RazorpayClient {
  private keyId: string;
  private keySecret: string;
  private apiBase = 'https://api.razorpay.com/v1';

  constructor(keyId?: string, keySecret?: string) {
    this.keyId = keyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
    this.keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || 'kW1234567890abcdef';
  }

  async createOrder(amount: number, receipt: string, description: string) {
    try {
      const response = await fetch(`${this.apiBase}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64'),
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          receipt,
          description,
          partial_payment: true,
          notes: {
            policy_name: 'Groceries',
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Razorpay API Error: ${error.error?.description || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Razorpay createOrder error:', error);
      throw error;
    }
  }

  async verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<boolean> {
    try {
      const hmac = crypto.createHmac('sha256', this.keySecret);
      const data = `${orderId}|${paymentId}`;
      hmac.update(data);
      const hash = hmac.digest('hex');
      return hash === signature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  async getPaymentDetails(paymentId: string) {
    try {
      const response = await fetch(`${this.apiBase}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64'),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payment details: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Razorpay getPaymentDetails error:', error);
      throw error;
    }
  }

  generateUPILink(orderId: string, amount: number, customerId: string, email: string) {
    // Generate a UPI string for intent-based payment
    // Format: upi://pay?pa=merchant_upi&pn=Merchant%20Name&am=amount&tn=description&tr=reference_id
    const upiParams = new URLSearchParams({
      pa: 'freshharvest@razorpay', // UPI ID (replace with actual)
      pn: 'FreshHarvest',
      am: amount.toString(),
      tn: `Order ${orderId}`,
      tr: orderId,
    });

    return `upi://pay?${upiParams.toString()}`;
  }
}

export function getRazorpayClient() {
  return new RazorpayClient();
}
