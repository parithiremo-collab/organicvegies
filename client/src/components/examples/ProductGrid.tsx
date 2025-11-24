import ProductGrid from '../ProductGrid';

export default function ProductGridExample() {
  return (
    <ProductGrid 
      onAddToCart={(id) => console.log('Add to cart:', id)}
      onProductClick={(id) => console.log('Product clicked:', id)}
    />
  );
}
