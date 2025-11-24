import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  price: string;
  quantity: number;
  weight: string;
}

interface Order {
  id: string;
  totalAmount: string;
  status: string;
  paymentStatus: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2?: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  deliverySlot: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetail() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['/api/orders', id],
    enabled: !!id,
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      confirmed: 'default',
      processing: 'default',
      shipped: 'secondary',
      delivered: 'default',
      cancelled: 'destructive',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 w-full">
        <Link href="/orders">
          <a className="flex items-center gap-2 text-primary hover:underline mb-8" data-testid="link-back-orders">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </a>
        </Link>

        {isLoading ? (
          <div className="text-center py-12">Loading order details...</div>
        ) : !order ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Order not found</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Order Header */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Order #{order.id.slice(0, 8)}</h1>
                  <p className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(order.status)} data-testid={`badge-order-status-${order.id}`}>
                    {order.status}
                  </Badge>
                  <Badge variant="outline" data-testid={`badge-payment-status-${order.id}`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.weight}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {item.quantity}</p>
                      <p className="text-sm">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Address */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-2 text-sm" data-testid="text-delivery-address">
                <p className="font-medium">{order.deliveryAddressLine1}</p>
                {order.deliveryAddressLine2 && <p>{order.deliveryAddressLine2}</p>}
                <p>{order.deliveryCity}, {order.deliveryState} {order.deliveryPincode}</p>
                <p className="text-muted-foreground">Slot: {order.deliverySlot}</p>
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span data-testid="text-order-total">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Continue Shopping Button */}
            <Link href="/">
              <a>
                <Button className="w-full" data-testid="button-continue-shopping">
                  Continue Shopping
                </Button>
              </a>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
