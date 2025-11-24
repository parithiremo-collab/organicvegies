import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import FarmerSection from "@/components/FarmerSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useToast } from "@/hooks/use-toast";
import type { Category, Product } from "@shared/schema";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight: string;
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast({
        title: "Updated cart",
        description: `Increased quantity of ${product.name}`,
      });
    } else {
      setCartItems([...cartItems, { 
        id: product.id,
        name: product.name,
        image: product.imageUrl,
        price: parseFloat(product.price),
        quantity: 1,
        weight: product.weight,
      }]);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
      variant: "destructive",
    });
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
