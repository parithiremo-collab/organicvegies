import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  image: string;
  productCount: number;
  onClick?: () => void;
}

export default function CategoryCard({ name, image, productCount, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-category-${name.toLowerCase()}`}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-accent text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{productCount} products</p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
}
