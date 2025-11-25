import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Loader } from "lucide-react";

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", id],
    queryFn: () =>
      apiRequest(`/api/orders/${id}`).then((r) => r.json()),
  });

  const statusSteps = [
    { status: "confirmed", label: "Confirmed", icon: CheckCircle },
    { status: "processing", label: "Processing", icon: Package },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.status === order.status);

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-order-tracking">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Order Header */}
          <Card className="p-6 border" data-testid="card-order-header">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
                <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge>{order.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</Badge>
            </div>
            <p className="text-lg font-semibold">₹{order.totalAmount}</p>
          </Card>

          {/* Tracking Timeline */}
          <Card className="p-8 border" data-testid="card-tracking-timeline">
            <h2 className="text-xl font-bold mb-8">Tracking Status</h2>
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step.status} className="flex gap-6">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        <StepIcon className="w-6 h-6" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-1 h-12 ${isActive ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>{step.label}</p>
                      <p className="text-sm text-muted-foreground">{isCurrent ? 'In progress' : 'Completed'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Delivery Details */}
          <Card className="p-6 border" data-testid="card-delivery-details">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{order.deliveryAddressLine1}</p>
              {order.deliveryAddressLine2 && <p>{order.deliveryAddressLine2}</p>}
              <p>{order.deliveryCity}, {order.deliveryState} {order.deliveryPincode}</p>
              <p className="text-muted-foreground mt-2">Delivery Slot: {order.deliverySlot}</p>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6 border" data-testid="card-order-items">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-semibold">₹{Number(item.price) * item.quantity}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
