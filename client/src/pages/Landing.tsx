import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Landing() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 dark:from-primary/10 dark:via-background dark:to-secondary/15 px-4 py-12">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-3xl w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Logo and Title */}
          <div className="flex flex-col items-center md:items-start justify-center order-2 md:order-1">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-secondary/10 dark:bg-secondary/20 border border-secondary/30">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('certified')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
              {t('heroTitle')}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
              Direct from organic farms to your table. Support local farmers and get fresh, certified produce delivered today.
            </p>

            <div className="space-y-3 mb-10 w-full max-w-md">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <span className="text-muted-foreground">{t('organicProducts')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 dark:bg-secondary/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-secondary">2</span>
                </div>
                <span className="text-muted-foreground">{t('farmToTable')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 dark:bg-accent/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent">3</span>
                </div>
                <span className="text-muted-foreground">{t('fastDelivery')}</span>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
              className="w-full md:w-auto px-8 py-6 text-lg"
              data-testid="button-login"
            >
              {t('signInWithReplit')}
            </Button>
          </div>

          {/* Logo Image */}
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 rounded-2xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-white/50 to-white/30 dark:from-white/10 dark:to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 dark:border-primary/30">
                <img 
                  src="/ulavar-angadi-logo.jpg" 
                  alt="Ulavar Angadi Logo" 
                  className="h-72 md:h-96 object-contain drop-shadow-lg" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
