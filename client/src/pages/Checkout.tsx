import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { Copy, CheckCircle, AlertCircle, Loader2, Info } from "lucide-react";
import QRCode from 'qrcode';

declare global {
  interface Window {
    Stripe: any;
  }
}

interface CartItemData extends Product {
  cartItemId: string;
  quantity: number;
}

export default function Checkout() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [deliverySlot, setDeliverySlot] = useState('morning');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiLink, setUpiLink] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    retry: 2,
  });

  const { data: rawCart = [], isLoading: cartLoading, error: cartError } = useQuery<any[]>({
    queryKey: ['/api/cart'],
    retry: 1,
  });

  useEffect(() => {
    if (rawCart && Array.isArray(rawCart) && rawCart.length > 0 && products.length > 0) {
      try {
        const enriched = rawCart
          .map((item: any) => {
            const product = products.find(p => p.id === item.productId);
            return product && item.quantity > 0 ? {
              ...product,
              cartItemId: item.id,
              quantity: item.quantity,
            } : null;
          })
          .filter((item: CartItemData | null): item is CartItemData => item !== null);
        setCartItems(enriched);
      } catch (error) {
        console.error('Error processing cart items:', error);
        toast({
          title: "Cart Error",
          description: "Failed to load cart items. Please refresh the page.",
          variant: "destructive",
        });
      }
    }
  }, [rawCart, products]);

  const totalAmount = cartItems.reduce((sum, item) => {
    try {
      return sum + (parseFloat(item.price) * item.quantity);
    } catch {
      return sum;
    }
  }, 0);
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const finalAmount = totalAmount + deliveryFee;

  const validateAddress = () => {
    const errors: Record<string, string> = {};
    
    if (!deliveryAddress.line1?.trim()) {
      errors.line1 = "Address is required";
    }
    if (!deliveryAddress.city?.trim()) {
      errors.city = "City is required";
    }
    if (!deliveryAddress.state?.trim()) {
      errors.state = "State is required";
    }
    if (!deliveryAddress.pincode?.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!validateAddress()) {
        throw new Error("Please fill all required fields correctly");
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          deliveryAddress, 
          deliverySlot,
          deliveryFee,
          paymentMethod,
        }),
      });
      
      let data: any = null;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error("Invalid server response");
      }
      
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create checkout");
      }
      
      if (!data) {
        throw new Error("No data received from server");
      }
      
      return data;
    },
    onSuccess: async (data) => {
      try {
        if (!data?.orderId) {
          throw new Error("No order ID received");
        }
        
        if (data?.paymentMethod === 'upi') {
          setCurrentOrderId(data.orderId);
          setPaymentStatus('processing');

          try {
            const qrRes = await fetch(`/api/razorpay/qr-code/${data.orderId}`);
            if (!qrRes.ok) {
              throw new Error("Failed to generate QR code. Please try again.");
            }
            
            let qrData: any = null;
            try {
              qrData = await qrRes.json();
            } catch (parseError) {
              console.error('QR response parse error:', parseError);
              throw new Error("Invalid QR code response format");
            }
            
            if (!qrData || !qrData.upiLink) {
              throw new Error("Invalid QR code data received");
            }
            
            setUpiLink(qrData.upiLink);

            if (qrCanvasRef.current) {
              try {
                await QRCode.toCanvas(qrCanvasRef.current, qrData.upiLink, {
                  width: 250,
                  margin: 2,
                  color: { dark: '#000000', light: '#ffffff' },
                });
              } catch (qrError) {
                console.error('QR generation error:', qrError);
                toast({
                  title: "QR Code Warning",
                  description: "Could not generate QR code. Use the UPI link instead.",
                });
              }
            }

            setPaymentStatus('idle');
            toast({
              title: "Payment Ready",
              description: "Scan the QR code or use the UPI link to complete payment",
            });
          } catch (qrError: any) {
            setPaymentStatus('failed');
            throw qrError;
          }
        } else if (data?.paymentMethod === 'card') {
          try {
            if (!data?.sessionId) {
              throw new Error("No Stripe session ID received");
            }
            
            const keyRes = await fetch("/api/stripe/publishable-key");
            if (!keyRes.ok) {
              throw new Error("Failed to load Stripe. Please try again.");
            }
            
            let keyData: any = null;
            try {
              keyData = await keyRes.json();
            } catch (parseError) {
              console.error('Stripe key response parse error:', parseError);
              throw new Error("Invalid Stripe key response format");
            }
            
            const publishableKey = keyData?.publishableKey;
            if (!publishableKey) {
              throw new Error("Stripe configuration missing");
            }

            if (typeof window === 'undefined' || !window.Stripe) {
              throw new Error("Stripe.js is not loaded. Please refresh and try again.");
            }

            const stripe = window.Stripe(publishableKey);
            if (!stripe) {
              throw new Error("Failed to initialize Stripe");
            }
            
            const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
            
            if (result?.error) {
              throw new Error(result.error?.message || "Stripe redirect failed");
            }
          } catch (stripeError: any) {
            setPaymentStatus('failed');
            throw stripeError;
          }
        } else {
          throw new Error("Invalid payment method");
        }
      } catch (error: any) {
        setPaymentStatus('failed');
        throw error;
      }
    },
    onError: (error: any) => {
      setPaymentStatus('failed');
      const errorMessage = error?.message || "Checkout failed. Please try again.";
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const isValid = Boolean(
    deliveryAddress.line1?.trim() && 
    deliveryAddress.city?.trim() && 
    deliveryAddress.state?.trim() && 
    deliveryAddress.pincode?.trim() &&
    /^\d{6}$/.test(deliveryAddress.pincode)
  );

  const hasEmptyCart = cartItems.length === 0;
  const isLoading = productsLoading || cartLoading;
  const hasError = productsError || cartError;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "UPI link copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={0} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={cartItems.length} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load checkout. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItems.length} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {hasEmptyCart ? (
          <Card className="p-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => window.history.back()}>Go Back Shopping</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Address */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Address Line 1 *"
                      value={deliveryAddress.line1}
                      onChange={(e) => {
                        setDeliveryAddress({ ...deliveryAddress, line1: e.target.value });
                        if (formErrors.line1) setFormErrors({ ...formErrors, line1: '' });
                      }}
                      data-testid="input-address-line1"
                      className={formErrors.line1 ? 'border-red-500' : ''}
                    />
                    {formErrors.line1 && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.line1}</p>
                    )}
                  </div>
                  <Input
                    placeholder="Address Line 2 (Optional)"
                    value={deliveryAddress.line2}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line2: e.target.value })}
                    data-testid="input-address-line2"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="City *"
                        value={deliveryAddress.city}
                        onChange={(e) => {
                          setDeliveryAddress({ ...deliveryAddress, city: e.target.value });
                          if (formErrors.city) setFormErrors({ ...formErrors, city: '' });
                        }}
                        data-testid="input-city"
                        className={formErrors.city ? 'border-red-500' : ''}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="State *"
                        value={deliveryAddress.state}
                        onChange={(e) => {
                          setDeliveryAddress({ ...deliveryAddress, state: e.target.value });
                          if (formErrors.state) setFormErrors({ ...formErrors, state: '' });
                        }}
                        data-testid="input-state"
                        className={formErrors.state ? 'border-red-500' : ''}
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Input
                      placeholder="Pincode (6 digits) *"
                      value={deliveryAddress.pincode}
                      onChange={(e) => {
                        setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value });
                        if (formErrors.pincode) setFormErrors({ ...formErrors, pincode: '' });
                      }}
                      data-testid="input-pincode"
                      maxLength={6}
                      className={formErrors.pincode ? 'border-red-500' : ''}
                    />
                    {formErrors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Delivery Slot */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Slot</h2>
                <div className="flex gap-4 flex-wrap">
                  {['morning', 'afternoon', 'evening'].map((slot) => (
                    <Button
                      key={slot}
                      variant={deliverySlot === slot ? "default" : "outline"}
                      onClick={() => setDeliverySlot(slot)}
                      data-testid={`button-slot-${slot}`}
                    >
                      {slot.charAt(0).toUpperCase() + slot.slice(1)}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex gap-4 flex-wrap">
                  <Button
                    variant={paymentMethod === 'upi' ? "default" : "outline"}
                    onClick={() => {
                      setPaymentMethod('upi');
                      setPaymentStatus('idle');
                      setUpiLink(null);
                    }}
                    data-testid="button-payment-upi"
                    className="flex-1"
                  >
                    UPI (Razorpay)
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? "default" : "outline"}
                    onClick={() => {
                      setPaymentMethod('card');
                      setPaymentStatus('idle');
                    }}
                    data-testid="button-payment-card"
                    className="flex-1"
                  >
                    Credit/Debit Card (Stripe)
                  </Button>
                </div>
              </Card>

              {/* UPI Payment QR Code Section */}
              {paymentMethod === 'upi' && currentOrderId && paymentStatus !== 'idle' && (
                <Card className="p-6 bg-blue-50 dark:bg-blue-950">
                  <h2 className="text-xl font-semibold mb-4">Scan to Pay</h2>
                  
                  {paymentStatus === 'processing' && (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                      <p className="text-muted-foreground">Generating payment QR code...</p>
                    </div>
                  )}

                  {paymentStatus === 'success' && (
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Payment confirmed! Redirecting to order confirmation...
                      </AlertDescription>
                    </Alert>
                  )}

                  {paymentStatus === 'failed' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Payment failed. Please try again or use a different payment method.
                      </AlertDescription>
                    </Alert>
                  )}

                  {(paymentStatus === 'idle' || paymentStatus === 'processing') && (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <canvas ref={qrCanvasRef} className="border-2 border-gray-300 rounded-lg p-2" />
                      </div>

                      {upiLink && (
                        <div className="space-y-2">
                          <Button
                            variant="default"
                            className="w-full"
                            onClick={() => window.open(upiLink, '_blank')}
                            data-testid="button-open-upi"
                          >
                            Open UPI App
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={() => copyToClipboard(upiLink)}
                            data-testid="button-copy-upi"
                          >
                            <Copy className="h-4 w-4" />
                            Copy UPI Link
                          </Button>
                        </div>
                      )}

                      <Alert className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                          Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.)
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {Object.keys(formErrors).length > 0 && (
                  <Alert className="mb-4" data-testid="alert-form-errors">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please fix the errors above
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={() => {
                    if (validateAddress()) {
                      checkoutMutation.mutate();
                    }
                  }}
                  disabled={!isValid || checkoutMutation.isPending || hasEmptyCart}
                  className="w-full"
                  data-testid="button-proceed-payment"
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : `Proceed to ${paymentMethod === 'upi' ? 'UPI' : 'Card'} Payment`}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
