import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Landing() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-slate-900 px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-2xl text-center">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-primary/10 rounded-lg">
            <Leaf className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="font-accent text-5xl md:text-6xl font-bold mb-4 text-foreground">
          Ulavar Angadi
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          {t('heroSubtitle')}
        </p>

        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">✓</div>
            <span>{t('certified')}</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">✓</div>
            <span>Transparent supply chain & farmer stories</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">✓</div>
            <span>Same-day delivery in select areas</span>
          </div>
        </div>

        <Button 
          size="lg"
          onClick={() => window.location.href = "/api/login"}
          className="px-8 py-6 text-lg"
          data-testid="button-login"
        >
          {t('signInWithReplit')}
        </Button>
      </div>
    </div>
  );
}
