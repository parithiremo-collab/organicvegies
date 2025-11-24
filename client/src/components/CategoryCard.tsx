import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { categoryTranslations } from "@/i18n/translations";

interface CategoryCardProps {
  name: string;
  image: string;
  productCount: number;
  onClick?: () => void;
}

export default function CategoryCard({ name, image, productCount, onClick }: CategoryCardProps) {
  const { language } = useTranslation();
  
  // Get translated category name, fallback to English name if not found
  const displayName = categoryTranslations[language]?.[name] || name;
  
  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover-elevate active-elevate-2 border"
      onClick={onClick}
      data-testid={`card-category-${name.toLowerCase()}`}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-base leading-tight">{displayName}</h3>
            <p className="text-xs text-muted-foreground mt-1">{productCount} {productCount === 1 ? 'product' : 'products'}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
}
