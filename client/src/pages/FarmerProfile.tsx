import { useParams } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Leaf, Shield, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductCard from "@/components/ProductCard";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import VerificationBadge from "@/components/VerificationBadge";
import { Loader } from "lucide-react";

export default function FarmerProfile() {
  const { id } = useParams<{ id: string }>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data: farmer, isLoading } = useQuery({
    queryKey: ["/api/farmers", id],
    queryFn: () =>
      apiRequest(`/api/farmers/${id}`).then((r) => r.json()),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/farmers", id, "products"],
    queryFn: () =>
      apiRequest(`/api/products?farmerId=${id}`).then((r) => 
        r.json().catch(() => [])
      ),
  });

  const selectedProduct = products.find((p: any) => p.id === selectedProductId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Farmer not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-farmer-profile">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Profile Header */}
          <Card className="p-8 border" data-testid="card-farmer-header">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={farmer.profileImageUrl} />
                <AvatarFallback>{farmer.firstName?.[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{farmer.farmName}</h1>
                  <VerificationBadge isVerified={farmer.isVerified} />
                </div>
                <p className="text-muted-foreground mb-4">{farmer.bio}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{farmer.farmArea}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="text-sm">{farmer.farmingType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm">{farmer.totalProductsSold} products sold</span>
                  </div>
                </div>

                {farmer.certifications && farmer.certifications.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {farmer.certifications.map((cert: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Products from {farmer.firstName}</h2>
            {products.length === 0 ? (
              <p className="text-muted-foreground">No products available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.imageUrl}
                    price={Number(product.price)}
                    mrp={Number(product.mrp)}
                    rating={Number(product.rating)}
                    reviewCount={product.reviewCount}
                    origin={product.origin}
                    inStock={product.inStock}
                    lowStock={product.lowStock}
                    weight={product.weight}
                    onClick={() => setSelectedProductId(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ProductDetailsModal
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
        product={selectedProduct}
      />

      <Footer />
    </div>
  );
}
