import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import FarmerSection from "@/components/FarmerSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Category, Product } from "@shared/schema";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

interface CartItemWithProduct extends CartItem {
  name: string;
  image: string;
  price: number;
  weight: string;
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();

  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    isError: categoriesError,
    refetch: refetchCategories
  } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: 2,
  });

  // Fetch products
  const { 
    data: products = [], 
    isLoading: productsLoading, 
    isError: productsError,
    refetch: refetchProducts
  } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    retry: 2,
  });

  // Fetch cart items
  const { data: rawCartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
    retry: false,
  });

  // Enrich cart items with product data
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  useEffect(() => {
    if (rawCartItems.length > 0 && products.length > 0) {
      const enriched = rawCartItems
        .map(item => {
          const product = products.find(p => p.id === item.productId);
          return product ? {
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            name: product.name,
            image: product.imageUrl,
            price: parseFloat(product.price),
            weight: product.weight,
          } : null;
        })
        .filter((item): item is CartItemWithProduct => item !== null);
      setCartItems(enriched);
    }
  }, [rawCartItems, products]);

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    },
    onSuccess: (_, productId) => {
      const product = products.find(p => p.id === productId);
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove from cart");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate(productId);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantityMutation.mutate({ id, quantity });
  };

  const handleRemoveItem = (id: string) => {
    removeItemMutation.mutate(id);
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Proceeding to checkout...",
    });
    console.log("Checkout with items:", cartItems);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        onSearchChange={setSearchValue}
        searchValue={searchValue}
      />
      
      <main className="flex-1">
        <Hero onShopNowClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} />
        
        {/* Categories Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-8">
              <h2 className="font-accent text-3xl sm:text-4xl font-semibold mb-3">
                Shop by Category
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore our fresh organic selection
              </p>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : categoriesError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Failed to load categories. Please try again.</p>
                <Button onClick={() => refetchCategories()} variant="outline" data-testid="button-retry-categories">
                  Retry
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    image={category.imageUrl}
                    productCount={category.productCount}
                    onClick={() => console.log('Category:', category.slug)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-accent text-3xl sm:text-4xl font-semibold mb-2">
                  Fresh Arrivals
                </h2>
                <p className="text-muted-foreground text-lg">
                  Handpicked organic produce delivered fresh
                </p>
              </div>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-96 bg-card animate-pulse rounded-lg" />
                ))}
              </div>
            ) : productsError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Failed to load products. Please try again.</p>
                <Button onClick={() => refetchProducts()} variant="outline" data-testid="button-retry-products">
                  Retry
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.imageUrl}
                    price={parseFloat(product.price)}
                    mrp={parseFloat(product.mrp)}
                    rating={parseFloat(product.rating)}
                    reviewCount={product.reviewCount}
                    origin={product.origin}
                    inStock={product.inStock}
                    lowStock={product.lowStock}
                    weight={product.weight}
                    onAddToCart={handleAddToCart}
                    onClick={(id) => console.log('Product:', id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <FarmerSection />
      </main>

      <Footer onNewsletterSubmit={(email) => {
        toast({
          title: "Subscribed!",
          description: `You've been subscribed with ${email}`,
        });
      }} />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

// Add at the bottom before the component ends - PHASE 5: SEO
import SEOHead from "@/components/SEOHead";
