import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

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
  deliveryCity: string;
  createdAt: string;
  items: OrderItem[];
}

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link href="/">
              <a className="text-primary hover:underline" data-testid="link-shop">
                Start shopping
              </a>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <a data-testid={`card-order-${order.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                          <Badge variant={getStatusColor(order.status)} data-testid={`badge-status-${order.id}`}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Delivery to: {order.deliveryCity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg" data-testid={`text-total-${order.id}`}>
                          ₹{parseFloat(order.totalAmount).toFixed(2)}
                        </p>
                        <Badge variant="outline" data-testid={`badge-payment-${order.id}`}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
