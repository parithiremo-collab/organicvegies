import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Loader } from "lucide-react";

export default function Wishlist() {
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["/api/wishlist"],
    queryFn: () =>
      apiRequest("/api/wishlist").then((r) =>
        r.json().catch(() => [])
      ),
  });

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-wishlist">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {wishlist.map((item: any) => (
                <ProductCard
                  key={item.productId}
                  id={item.product.id}
                  name={item.product.name}
                  image={item.product.imageUrl}
                  price={Number(item.product.price)}
                  mrp={Number(item.product.mrp)}
                  rating={Number(item.product.rating)}
                  reviewCount={item.product.reviewCount}
                  origin={item.product.origin}
                  inStock={item.product.inStock}
                  lowStock={item.product.lowStock}
                  weight={item.product.weight}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
