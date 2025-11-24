import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, MapPin } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { productTranslations } from "@/i18n/translations";
import { useLocation } from "wouter";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  origin: string;
  inStock: boolean;
  lowStock?: boolean;
  weight: string;
  onAddToCart?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  mrp,
  rating,
  reviewCount,
  origin,
  inStock,
  lowStock,
  weight,
  onAddToCart,
  onClick
}: ProductCardProps) {
  const { language, t } = useTranslation();
  const [_, navigate] = useLocation();
  
  // Get translated product name, fallback to English name if not found
  const translatedProduct = productTranslations[language]?.[id];
  const displayName = translatedProduct?.name || name;
  
  const discount = Math.round(((mrp - price) / mrp) * 100);

  return (
    <Card 
      className="group overflow-hidden hover-elevate cursor-pointer border"
      onClick={() => onClick?.(id)}
      data-testid={`card-product-${id}`}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-semibold">
            {discount}% OFF
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">{t('outOfStock')}</Badge>
          </div>
        )}
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1.5 cursor-pointer hover:text-primary" onClick={() => navigate(`/products/${id}`)}>{displayName}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{origin}</span>
            </div>
          </div>
          <WishlistButton productId={id} />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating}</span>
          </div>
          <span className="text-muted-foreground">({reviewCount})</span>
          {lowStock && (
            <Badge variant="secondary" className="ml-auto text-xs px-2">Low Stock</Badge>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-xl font-bold">${price}</span>
          {mrp > price && (
            <span className="text-xs text-muted-foreground line-through">₹{mrp}</span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{weight}</span>
        </div>

        <Button 
          className="w-full gap-2"
          disabled={!inStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(id);
          }}
          data-testid={`button-add-to-cart-${id}`}
        >
          <ShoppingCart className="h-4 w-4" />
          {inStock ? t('addToCart') : t('outOfStock')}
        </Button>
      </div>
    </Card>
  );
}
