import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@assets/generated_images/hero_section_organic_produce.png";
import { useTranslation } from "@/i18n/useTranslation";

interface HeroProps {
  onShopNowClick?: () => void;
}

export default function Hero({ onShopNowClick }: HeroProps) {
  const { t } = useTranslation();
  return (
    <section className="relative h-96 sm:h-[500px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary text-foreground">
              <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
              {t('certified')}
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary text-foreground">
              {t('freeDeliveryOver')}
            </Badge>
          </div>
          
          <h1 className="font-accent text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t('heroTitle')}
          </h1>
          
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-xl">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="gap-2"
              onClick={onShopNowClick}
              data-testid="button-shop-now"
            >
              {t('shopNow')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20"
              data-testid="button-our-farmers"
            >
              Meet Our Farmers
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-6 text-white/90">
            <div>
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Local Farmers</div>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm">Organic Certified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
