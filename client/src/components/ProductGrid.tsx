import ProductCard from "./ProductCard";
import tomatoesImage from "@assets/generated_images/tomatoes_product_sample.png";
import bananasImage from "@assets/generated_images/bananas_product_sample.png";
import carrotsImage from "@assets/generated_images/carrots_product_sample.png";
import riceImage from "@assets/generated_images/rice_product_sample.png";

interface ProductGridProps {
  onAddToCart?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
}

export default function ProductGrid({ onAddToCart, onProductClick }: ProductGridProps) {
  const products = [
    {
      id: "tomatoes-1kg",
      name: "Organic Tomatoes on Vine",
      image: tomatoesImage,
      price: 85,
      mrp: 120,
      rating: 4.5,
      reviewCount: 234,
      origin: "Maharashtra",
      inStock: true,
      lowStock: false,
      weight: "1 kg",
    },
    {
      id: "bananas-6pcs",
      name: "Organic Bananas",
      image: bananasImage,
      price: 48,
      mrp: 60,
      rating: 4.7,
      reviewCount: 189,
      origin: "Tamil Nadu",
      inStock: true,
      lowStock: true,
      weight: "6 pcs",
    },
    {
      id: "carrots-500g",
      name: "Fresh Organic Carrots with Greens",
      image: carrotsImage,
      price: 55,
      mrp: 75,
      rating: 4.6,
      reviewCount: 156,
      origin: "Punjab",
      inStock: true,
      lowStock: false,
      weight: "500 g",
    },
    {
      id: "rice-5kg",
      name: "Organic Basmati Rice",
      image: riceImage,
      price: 425,
      mrp: 550,
      rating: 4.8,
      reviewCount: 421,
      origin: "Uttarakhand",
      inStock: true,
      lowStock: false,
      weight: "5 kg",
    },
    {
      id: "tomatoes-2kg",
      name: "Organic Cherry Tomatoes",
      image: tomatoesImage,
      price: 145,
      mrp: 180,
      rating: 4.4,
      reviewCount: 98,
      origin: "Karnataka",
      inStock: false,
      lowStock: false,
      weight: "500 g",
    },
    {
      id: "carrots-1kg",
      name: "Organic Purple Carrots",
      image: carrotsImage,
      price: 95,
      mrp: 120,
      rating: 4.3,
      reviewCount: 67,
      origin: "Himachal Pradesh",
      inStock: true,
      lowStock: true,
      weight: "1 kg",
    },
  ];

  return (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={onAddToCart}
              onClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
