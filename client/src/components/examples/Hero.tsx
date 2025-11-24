import Hero from '../Hero';

export default function HeroExample() {
  return <Hero onShopNowClick={() => console.log('Shop Now clicked')} />;
}
