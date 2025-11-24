import { useState, useEffect } from "react";
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

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: rawCart = [] } = useQuery<any[]>({
    queryKey: ['/api/cart'],
  });

  useEffect(() => {
    if (rawCart && rawCart.length > 0 && products.length > 0) {
      const enriched = rawCart
        .map((item: any) => {
          const product = products.find(p => p.id === item.productId);
          return product ? {
            ...product,
            cartItemId: item.id,
            quantity: item.quantity,
          } : null;
        })
        .filter((item: CartItemData | null): item is CartItemData => item !== null);
      setCartItems(enriched);
    }
  }, [rawCart, products]);

  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const finalAmount = totalAmount + deliveryFee;

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting checkout...', { deliveryAddress, deliverySlot, deliveryFee, paymentMethod });
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
      const data = await res.json();
      console.log('Checkout response:', { status: res.status, data });
      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }
      return data;
    },
    onSuccess: async (data) => {
      try {
        console.log('Checkout success, creating Stripe session...');
        // Get Stripe publishable key
        const keyRes = await fetch("/api/stripe/publishable-key");
        if (!keyRes.ok) {
          throw new Error("Failed to fetch Stripe key");
        }
        const { publishableKey } = await keyRes.json();
        console.log('Got Stripe key, redirecting to checkout...');

        // Redirect to Stripe checkout
        if (window.Stripe) {
          const stripe = window.Stripe(publishableKey);
          console.log('Stripe instance created, redirecting...');
          const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (result.error) {
            throw new Error(result.error.message);
          }
        } else {
          throw new Error('Stripe.js not loaded');
        }
      } catch (error: any) {
        console.error("Stripe redirect error:", error);
        toast({
          title: "Payment Error",
          description: error.message || "Failed to redirect to payment",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    },
  });

  const isValid = Boolean(
    deliveryAddress.line1?.trim() && 
    deliveryAddress.city?.trim() && 
    deliveryAddress.state?.trim() && 
    deliveryAddress.pincode?.trim()
  );

  const hasEmptyCart = cartItems.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItems.length} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {hasEmptyCart ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Address */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <Input
                    placeholder="Address Line 1"
                    value={deliveryAddress.line1}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line1: e.target.value })}
                    data-testid="input-address-line1"
                  />
                  <Input
                    placeholder="Address Line 2 (Optional)"
                    value={deliveryAddress.line2}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, line2: e.target.value })}
                    data-testid="input-address-line2"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      data-testid="input-city"
                    />
                    <Input
                      placeholder="State"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                      data-testid="input-state"
                    />
                  </div>
                  <Input
                    placeholder="Pincode"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                    data-testid="input-pincode"
                  />
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
                    onClick={() => setPaymentMethod('upi')}
                    data-testid="button-payment-upi"
                    className="flex-1"
                  >
                    UPI
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? "default" : "outline"}
                    onClick={() => setPaymentMethod('card')}
                    data-testid="button-payment-card"
                    className="flex-1"
                  >
                    Credit/Debit Card
                  </Button>
                </div>
              </Card>
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

                {!isValid && (
                  <Alert className="mb-4" data-testid="alert-invalid-address">
                    <AlertDescription>
                      Please fill in all delivery address details to continue
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={() => {
                    console.log('Checkout button clicked');
                    checkoutMutation.mutate();
                  }}
                  disabled={!isValid || checkoutMutation.isPending || hasEmptyCart}
                  className="w-full"
                  data-testid="button-proceed-payment"
                >
                  {checkoutMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
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
