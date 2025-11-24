import CategoryCard from "./CategoryCard";
import vegetablesImage from "@assets/generated_images/vegetables_category_image.png";
import fruitsImage from "@assets/generated_images/fruits_category_image.png";
import grainsImage from "@assets/generated_images/grains_category_image.png";
import dairyImage from "@assets/generated_images/dairy_category_image.png";

interface CategoryGridProps {
  onCategoryClick?: (category: string) => void;
}

export default function CategoryGrid({ onCategoryClick }: CategoryGridProps) {
  const categories = [
    { name: "Vegetables", image: vegetablesImage, productCount: 45 },
    { name: "Fruits", image: fruitsImage, productCount: 38 },
    { name: "Grains & Pulses", image: grainsImage, productCount: 52 },
    { name: "Dairy", image: dairyImage, productCount: 28 },
  ];

  return (
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              image={category.image}
              productCount={category.productCount}
              onClick={() => onCategoryClick?.(category.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
