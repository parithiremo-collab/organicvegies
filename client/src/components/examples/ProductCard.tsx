import ProductCard from '../ProductCard';
import tomatoesImage from '@assets/generated_images/tomatoes_product_sample.png';

export default function ProductCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <ProductCard 
        id="tomatoes-1kg"
        name="Organic Tomatoes on Vine"
        image={tomatoesImage}
        price={85}
        mrp={120}
        rating={4.5}
        reviewCount={234}
        origin="Maharashtra"
        inStock={true}
        lowStock={false}
        weight="1 kg"
        onAddToCart={(id) => console.log('Add to cart:', id)}
        onClick={(id) => console.log('Product clicked:', id)}
      />
    </div>
  );
}
