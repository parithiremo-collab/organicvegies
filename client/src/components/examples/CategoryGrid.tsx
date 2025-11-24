import CategoryGrid from '../CategoryGrid';

export default function CategoryGridExample() {
  return (
    <CategoryGrid onCategoryClick={(category) => console.log('Category clicked:', category)} />
  );
}
