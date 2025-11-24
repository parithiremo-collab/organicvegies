import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ProductCard from "@/components/ProductCard";
import { Loader } from "lucide-react";

export default function Shop() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : 0,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : 1000,
    inStock: params.get("inStock") === "true",
    sortBy: params.get("sort") || "newest",
  });

  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.set("search", filters.search);
  queryParams.set("minPrice", String(filters.minPrice));
  queryParams.set("maxPrice", String(filters.maxPrice));
  if (filters.inStock) queryParams.set("inStock", "true");
  queryParams.set("sort", filters.sortBy);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", filters],
    queryFn: () =>
      apiRequest(`/api/products?${queryParams.toString()}`).then((r) =>
        r.json().catch(() => [])
      ),
  });

  const sorted = useMemo(() => {
    let sorted = [...products];
    switch (filters.sortBy) {
      case "price-low":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      default:
        sorted.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return sorted;
  }, [products, filters.sortBy]);

  return (
    <div className="min-h-screen bg-background py-8" data-testid="page-shop">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex justify-center">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterPanel onFiltersChange={setFilters} />
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 animate-spin" />
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sorted.map((product: any) => (
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
