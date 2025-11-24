import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus, ShoppingCart, TrendingUp, Package } from "lucide-react";
import type { Category } from "@shared/schema";

interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  farmArea?: string;
  farmingType?: string;
  certifications?: string[];
  bio?: string;
  totalProductsSold: number;
  earnings: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  inStock: boolean;
}

export default function FarmerDashboard() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    farmName: "",
    farmArea: "",
    farmingType: "organic",
    bio: "",
  });
  const [productData, setProductData] = useState({
    categoryId: "",
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    mrp: "",
    origin: "",
    weight: "",
    stock: "",
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/farmer/profile"],
    queryFn: async () => {
      const res = await fetch("/api/farmer/profile");
      return res.json();
    },
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/farmer/products"],
    queryFn: async () => {
      const res = await fetch("/api/farmer/products");
      return res.json();
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/farmer/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/farmer/analytics");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      return res.json();
    },
  });

  const profileMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/farmer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error("Failed to create profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer/profile"] });
      toast({ title: "Success", description: "Profile created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const productMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/farmer/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Failed to add product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer/products"] });
      setProductData({
        categoryId: "",
        name: "",
        description: "",
        imageUrl: "",
        price: "",
        mrp: "",
        origin: "",
        weight: "",
        stock: "",
      });
      setOpenDialog(false);
      toast({ title: "Success", description: "Product added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={0} />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-900">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm font-semibold">Get Started</span>
            </div>
            <h2 className="text-4xl font-bold mb-3 text-green-900 dark:text-green-50">Welcome to Ulavar Angadi</h2>
            <p className="text-lg text-green-700 dark:text-green-200 mb-8">
              Create your farm profile and start selling organic products directly to customers. Build your brand and grow your business today.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-green-900 dark:text-green-100">Farm Name</label>
                <Input
                  placeholder="e.g., Green Valley Organic Farm"
                  value={profileData.farmName}
                  onChange={(e) => setProfileData({ ...profileData, farmName: e.target.value })}
                  data-testid="input-farm-name"
                  className="border-green-300 dark:border-green-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-green-900 dark:text-green-100">Farm Area</label>
                <Input
                  placeholder="e.g., 5 acres"
                  value={profileData.farmArea}
                  onChange={(e) => setProfileData({ ...profileData, farmArea: e.target.value })}
                  data-testid="input-farm-area"
                  className="border-green-300 dark:border-green-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-green-900 dark:text-green-100">Farming Type</label>
                <select
                  value={profileData.farmingType}
                  onChange={(e) => setProfileData({ ...profileData, farmingType: e.target.value })}
                  className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-900"
                  data-testid="select-farming-type"
                >
                  <option value="organic">Organic</option>
                  <option value="mixed">Mixed</option>
                  <option value="conventional">Conventional</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-semibold text-green-900 dark:text-green-100">About Your Farm</label>
                <Textarea
                  placeholder="Tell customers about your farm, farming practices, and unique products..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  data-testid="textarea-farm-bio"
                />
              </div>
              <Button
                onClick={() => profileMutation.mutate()}
                disabled={profileMutation.isPending}
                className="w-full md:col-span-2"
                data-testid="button-create-profile"
              >
                Create Profile
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Header cartItemCount={0} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-green-900 dark:text-green-100 mb-2">{profile.farmName}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{profile.bio}</p>
        </div>

        {/* Analytics Cards with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-900 hover-elevate">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-1">Total Sales</p>
                <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">{analytics?.totalSales || 0}</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-blue-300 dark:text-blue-700" />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">items sold</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-900 hover-elevate">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-300 mb-1">Total Earnings</p>
                <p className="text-4xl font-bold text-green-900 dark:text-green-100">₹{analytics?.totalEarnings || "0"}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-300 dark:text-green-700" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">from sales</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-900 hover-elevate">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-300 mb-1">Active Products</p>
                <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">{products.length}</p>
              </div>
              <Package className="w-10 h-10 text-purple-300 dark:text-purple-700" />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">available</p>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="mb-12">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-2" data-testid="button-add-product">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-add-product">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={productData.categoryId} onValueChange={(value) => setProductData({ ...productData, categoryId: value })}>
                  <SelectTrigger data-testid="select-product-category">
                    <SelectValue placeholder="Select Product Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Product Name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  data-testid="input-product-name"
                />
                <Textarea
                  placeholder="Description"
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  data-testid="textarea-product-description"
                />
                <Input
                  placeholder="Price (₹)"
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  data-testid="input-product-price"
                />
                <Input
                  placeholder="MRP (₹)"
                  type="number"
                  value={productData.mrp}
                  onChange={(e) => setProductData({ ...productData, mrp: e.target.value })}
                  data-testid="input-product-mrp"
                />
                <Input
                  placeholder="Origin (e.g., Karnataka)"
                  value={productData.origin}
                  onChange={(e) => setProductData({ ...productData, origin: e.target.value })}
                  data-testid="input-product-origin"
                />
                <Input
                  placeholder="Weight (e.g., 1kg)"
                  value={productData.weight}
                  onChange={(e) => setProductData({ ...productData, weight: e.target.value })}
                  data-testid="input-product-weight"
                />
                <Input
                  placeholder="Stock Quantity"
                  type="number"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  data-testid="input-product-stock"
                />
                <Button
                  onClick={() => productMutation.mutate()}
                  disabled={productMutation.isPending}
                  className="w-full"
                  data-testid="button-submit-product"
                >
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-50">Your Products</h2>
          {products.length === 0 ? (
            <Card className="p-12 text-center bg-slate-50 dark:bg-slate-900 border-dashed">
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">No products yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">Add your first product to start selling</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <Card key={product.id} className="p-6 hover-elevate border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" data-testid={`card-product-${product.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{product.name}</h3>
                    {product.stock > 0 ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 text-xs font-semibold rounded-full">In Stock</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-xs font-semibold rounded-full">Out of Stock</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">₹{product.price}</p>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Stock Available: <span className="font-semibold text-slate-900 dark:text-slate-100">{product.stock} units</span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
