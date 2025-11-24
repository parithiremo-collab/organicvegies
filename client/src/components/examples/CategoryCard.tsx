import CategoryCard from '../CategoryCard';
import vegetablesImage from '@assets/generated_images/vegetables_category_image.png';

export default function CategoryCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <CategoryCard 
        name="Vegetables"
        image={vegetablesImage}
        productCount={45}
        onClick={() => console.log('Vegetables category clicked')}
      />
    </div>
  );
}
