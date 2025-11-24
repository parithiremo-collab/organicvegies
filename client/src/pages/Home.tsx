import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import FarmerSection from "@/components/FarmerSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useToast } from "@/hooks/use-toast";
import tomatoesImage from "@assets/generated_images/tomatoes_product_sample.png";
import bananasImage from "@assets/generated_images/bananas_product_sample.png";

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

  const handleAddToCart = (productId: string) => {
    const productMap: Record<string, Omit<CartItem, 'quantity'>> = {
      "tomatoes-1kg": {
        id: "tomatoes-1kg",
        name: "Organic Tomatoes on Vine",
        image: tomatoesImage,
        price: 85,
        weight: "1 kg",
      },
      "bananas-6pcs": {
        id: "bananas-6pcs",
        name: "Organic Bananas",
        image: bananasImage,
        price: 48,
        weight: "6 pcs",
      },
    };

    const product = productMap[productId];
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
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
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
        <CategoryGrid onCategoryClick={(category) => console.log('Category:', category)} />
        <ProductGrid 
          onAddToCart={handleAddToCart}
          onProductClick={(id) => console.log('Product:', id)}
        />
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
