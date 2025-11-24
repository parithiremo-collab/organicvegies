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
import { Plus } from "lucide-react";
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
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Farmer Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Create your farm profile to start selling organic products
            </p>

            <div className="space-y-4">
              <Input
                placeholder="Farm Name"
                value={profileData.farmName}
                onChange={(e) => setProfileData({ ...profileData, farmName: e.target.value })}
                data-testid="input-farm-name"
              />
              <Input
                placeholder="Farm Area (e.g., 5 acres)"
                value={profileData.farmArea}
                onChange={(e) => setProfileData({ ...profileData, farmArea: e.target.value })}
                data-testid="input-farm-area"
              />
              <select
                value={profileData.farmingType}
                onChange={(e) => setProfileData({ ...profileData, farmingType: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                data-testid="select-farming-type"
              >
                <option value="organic">Organic</option>
                <option value="mixed">Mixed</option>
                <option value="conventional">Conventional</option>
              </select>
              <Textarea
                placeholder="Tell us about your farm..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                data-testid="textarea-farm-bio"
              />
              <Button
                onClick={() => profileMutation.mutate()}
                disabled={profileMutation.isPending}
                className="w-full"
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
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{profile.farmName}</h1>
          <p className="text-muted-foreground">{profile.bio}</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-3xl font-bold">{analytics?.totalSales || 0}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="text-3xl font-bold">₹{analytics?.totalEarnings || "0"}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Active Products</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-product">
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
          <h2 className="text-2xl font-bold mb-4">Your Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product: Product) => (
              <Card key={product.id} className="p-4" data-testid={`card-product-${product.id}`}>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Price: ₹{product.price}
                </p>
                <p className="text-sm mb-3">
                  Stock: <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                    {product.stock}
                  </span>
                </p>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
