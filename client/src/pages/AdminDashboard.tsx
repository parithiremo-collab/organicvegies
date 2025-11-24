import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Users, ShoppingCart, User, Zap } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [adminData] = useState({
    adminName: "",
    department: "Moderation",
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      return res.json();
    },
  });

  const { data: pendingFarmers = [] } = useQuery({
    queryKey: ["/api/admin/farmers/pending"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/farmers/pending");
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching pending farmers:", error);
        return [];
      }
    },
  });

  const { data: pendingProducts = [] } = useQuery({
    queryKey: ["/api/admin/products/pending"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/products/pending");
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error fetching pending products:", error);
        return [];
      }
    },
  });

  const approveFarmerMutation = useMutation({
    mutationFn: async (farmerId: string) => {
      const res = await fetch(`/api/admin/farmers/${farmerId}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/farmers/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Farmer approved" });
    },
  });

  const approveProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/admin/products/${productId}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Product approved" });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">₹{stats?.totalRevenue || "0"}</p>
              </div>
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-3xl font-bold">{stats?.pendingApprovals || 0}</p>
              </div>
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Tabs defaultValue="farmers" className="w-full" data-testid="tabs-admin-management">
          <TabsList className="grid w-full grid-cols-2" data-testid="tabs-list-admin">
            <TabsTrigger value="farmers" data-testid="tab-farmers">Farmers</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
          </TabsList>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Pending Farmer Approvals</h2>
              {pendingFarmers.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No pending farmers</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingFarmers.map((farmer: any) => (
                    <Card key={farmer.userId} className="p-4" data-testid={`card-farmer-${farmer.userId}`}>
                      <h3 className="font-semibold mb-2">{farmer.farmName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Area: {farmer.farmArea}</p>
                      <p className="text-sm text-muted-foreground mb-4">Type: {farmer.farmingType}</p>
                      <Button
                        onClick={() => approveFarmerMutation.mutate(farmer.userId)}
                        disabled={approveFarmerMutation.isPending}
                        className="w-full"
                        data-testid={`button-approve-farmer-${farmer.userId}`}
                      >
                        Approve Farmer
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Pending Product Approvals</h2>
              {pendingProducts.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No pending products</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingProducts.map((product: any) => (
                    <Card key={product.id} className="p-4" data-testid={`card-product-${product.id}`}>
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Price: ₹{product.price}</p>
                      <p className="text-sm text-muted-foreground mb-2">Origin: {product.origin}</p>
                      <p className="text-sm text-muted-foreground mb-4">Description: {product.description}</p>
                      <Button
                        onClick={() => approveProductMutation.mutate(product.id)}
                        disabled={approveProductMutation.isPending}
                        className="w-full"
                        data-testid={`button-approve-product-${product.id}`}
                      >
                        Approve Product
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
