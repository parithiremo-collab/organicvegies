import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryAddress, deliverySlot }),
      });
      if (!res.ok) throw new Error("Failed to create checkout");
      return res.json();
    },
    onSuccess: async (data) => {
      // Get Stripe publishable key
      const keyRes = await fetch("/api/stripe/publishable-key");
      const { publishableKey } = await keyRes.json();

      // Redirect to Stripe checkout
      if (window.Stripe) {
        const stripe = window.Stripe(publishableKey);
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error('Stripe.js not loaded');
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    },
  });

  const isValid = deliveryAddress.line1 && deliveryAddress.city && deliveryAddress.state && deliveryAddress.pincode;

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItems.length} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

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
              <div className="flex gap-4">
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
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
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

              <Button
                onClick={() => checkoutMutation.mutate()}
                disabled={!isValid || checkoutMutation.isPending}
                className="w-full"
                data-testid="button-proceed-payment"
              >
                {checkoutMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
