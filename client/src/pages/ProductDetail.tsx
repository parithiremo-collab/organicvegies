import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ReviewsSection from "@/components/ReviewsSection";
import WishlistButton from "@/components/WishlistButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function ProductDetail() {
  const [location, navigate] = useLocation();
  const productId = location.split("/").pop();
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
    queryFn: () =>
      apiRequest(`/api/products`).then((r) =>
        r.json().then((products: any[]) =>
          products.find((p) => p.id === productId)
        )
      ),
  });

  const addToCartMutation = async () => {
    try {
      const response = await apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: Number(quantity) }),
      });
      if (!response.ok) {
        toast({ title: "Failed to add to cart", variant: "destructive" });
        return;
      }
      queryClient.invalidateQueryData({ queryKey: ["/api/cart"] });
      toast({ title: "Added to cart!" });
      setCartOpen(true);
    } catch (error) {
      toast({ title: "Error adding to cart", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const discount = Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100);

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-product-detail">
      <Header />
      <CartDrawer isOpen={cartOpen} onOpenChange={setCartOpen} />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <Card className="overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{product.origin}</span>
                    </div>
                  </div>
                  <WishlistButton productId={product.id} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold">₹{product.price}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">₹{product.mrp}</span>
                      <Badge className="bg-red-500">{discount}% OFF</Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{product.weight}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(Number(product.rating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              {!product.inStock && (
                <Badge variant="secondary" className="w-full text-center justify-center py-2">
                  Out of Stock
                </Badge>
              )}

              {product.lowStock && product.inStock && (
                <Badge variant="outline" className="w-full text-center justify-center py-2">
                  Low Stock
                </Badge>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20 p-2 border rounded-md"
                    data-testid="input-quantity"
                  />
                </div>
                <Button
                  onClick={addToCartMutation}
                  disabled={!product.inStock}
                  className="w-full gap-2"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          <ReviewsSection productId={product.id} isAuthenticated={!!user} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
