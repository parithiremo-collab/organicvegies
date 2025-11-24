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
import { Users, ShoppingCart, User, Zap, CheckCircle, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Header cartItemCount={0} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100">Admin Dashboard</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Manage platform, approve content, and monitor growth</p>
        </div>

        {/* Stats Cards with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-900 hover-elevate">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-300 mb-1">Total Users</p>
                <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="w-10 h-10 text-purple-300 dark:text-purple-700" />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">registered users</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-900 hover-elevate">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-1">Total Orders</p>
                <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">{stats?.totalOrders || 0}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-blue-300 dark:text-blue-700" />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">completed orders</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-900 hover-elevate">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300 mb-1">Total Revenue</p>
                <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">₹{stats?.totalRevenue || "0"}</p>
              </div>
              <Zap className="w-10 h-10 text-emerald-300 dark:text-emerald-700" />
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">platform revenue</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-900 hover-elevate">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-300 mb-1">Pending Approvals</p>
                <p className="text-4xl font-bold text-orange-900 dark:text-orange-100">{stats?.pendingApprovals || 0}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-300 dark:text-orange-700" />
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">awaiting action</p>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Tabs defaultValue="farmers" className="w-full" data-testid="tabs-admin-management">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1" data-testid="tabs-list-admin">
            <TabsTrigger value="farmers" data-testid="tab-farmers" className="font-semibold">Farmers</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products" className="font-semibold">Products</TabsTrigger>
          </TabsList>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-6 mt-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-50">Pending Farmer Approvals</h2>
              {pendingFarmers.length === 0 ? (
                <Card className="p-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-dashed border-green-200 dark:border-green-800">
                  <CheckCircle className="w-16 h-16 text-green-400 dark:text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">All caught up!</p>
                  <p className="text-sm text-green-700 dark:text-green-300">No pending farmer approvals</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingFarmers.map((farmer: any) => (
                    <Card key={farmer.userId} className="p-6 hover-elevate border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" data-testid={`card-farmer-${farmer.userId}`}>
                      <div className="mb-4">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 mb-2">{farmer.farmName}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Awaiting approval</p>
                      </div>
                      <div className="space-y-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Area:</span>
                          <span className="text-sm text-slate-900 dark:text-slate-50">{farmer.farmArea}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Type:</span>
                          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 text-xs font-semibold rounded-full capitalize">{farmer.farmingType}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => approveFarmerMutation.mutate(farmer.userId)}
                        disabled={approveFarmerMutation.isPending}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                        data-testid={`button-approve-farmer-${farmer.userId}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Farmer
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 mt-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-50">Pending Product Approvals</h2>
              {pendingProducts.length === 0 ? (
                <Card className="p-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-dashed border-green-200 dark:border-green-800">
                  <CheckCircle className="w-16 h-16 text-green-400 dark:text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">All products approved!</p>
                  <p className="text-sm text-green-700 dark:text-green-300">No pending product approvals</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingProducts.map((product: any) => (
                    <Card key={product.id} className="p-6 hover-elevate border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" data-testid={`card-product-${product.id}`}>
                      <div className="mb-4">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 mb-2">{product.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Pending review</p>
                      </div>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">₹{product.price}</p>
                      <div className="space-y-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Origin:</span>
                          <span className="text-sm text-slate-900 dark:text-slate-50">{product.origin}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => approveProductMutation.mutate(product.id)}
                        disabled={approveProductMutation.isPending}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
                        data-testid={`button-approve-product-${product.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
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
