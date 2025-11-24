import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, MapPin } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { productTranslations } from "@/i18n/translations";

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
  
  // Get translated product name, fallback to English name if not found
  const translatedProduct = productTranslations[language]?.[id];
  const displayName = translatedProduct?.name || name;
  
  const discount = Math.round(((mrp - price) / mrp) * 100);

  return (
    <Card 
      className="group overflow-hidden hover-elevate cursor-pointer"
      onClick={() => onClick?.(id)}
      data-testid={`card-product-${id}`}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            {discount}% OFF
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">{t('outOfStock')}</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-base line-clamp-2 mb-1">{displayName}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{origin}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
          {lowStock && (
            <Badge variant="secondary" className="ml-auto text-xs">Low Stock</Badge>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">₹{price}</span>
          {mrp > price && (
            <span className="text-sm text-muted-foreground line-through">₹{mrp}</span>
          )}
          <span className="text-sm text-muted-foreground ml-auto">{weight}</span>
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
