import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Mail } from "lucide-react";
import { SiVisa, SiMastercard } from "react-icons/si";
import { Link } from "wouter";
import { useTranslation } from "@/i18n/useTranslation";
import { useAuth } from "@/hooks/useAuth";

interface FooterProps {
  onNewsletterSubmit?: (email: string) => void;
}

export default function Footer({ onNewsletterSubmit }: FooterProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const isSeller = user?.role === "farmer";
  const isAgent = user?.role === "agent";
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isCustomer = user?.role === "customer";
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    onNewsletterSubmit?.(email);
  };

  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 to-primary/5 dark:from-muted/40 dark:to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/ulavar-angadi-logo.png" alt="Ulavar Angadi" className="h-8 object-contain" />
              <h3 className="font-accent text-xl font-bold text-primary">Ulavar Angadi</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {isCustomer && "Fresh organic produce delivered directly from certified farmers to your doorstep."}
              {isSeller && "Sell your certified organic produce to thousands of customers nationwide."}
              {isAgent && "Distribute organic products and earn competitive commissions."}
              {isAdmin && "Manage and moderate the Ulavar Angadi marketplace platform."}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{t('certified')}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {isCustomer && t('customerService')}
              {isSeller && "Farmer Tools"}
              {isAgent && "Agent Resources"}
              {isAdmin && "Admin Features"}
            </h4>
            <ul className="space-y-2 text-sm">
              {isCustomer && (
                <>
                  <li>
                    <Link href="/orders" className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-my-orders">
                      {t('orders')}
                    </Link>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-contact">
                      Contact: support@ulavarangadi.com
                    </span>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-phone">
                      Phone: +91-9876-543-210
                    </span>
                  </li>
                </>
              )}
              {isSeller && (
                <>
                  <li>
                    <Link href="/" className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-farmer-dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-seller-support">
                      Seller Support
                    </span>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-seller-email">
                      farmers@ulavarangadi.com
                    </span>
                  </li>
                </>
              )}
              {isAgent && (
                <>
                  <li>
                    <Link href="/" className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-agent-dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-agent-support">
                      Agent Support
                    </span>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-agent-email">
                      agents@ulavarangadi.com
                    </span>
                  </li>
                </>
              )}
              {isAdmin && (
                <>
                  <li>
                    <Link href="/" className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-admin-dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-admin-support">
                      Moderation Tools
                    </span>
                  </li>
                  <li>
                    <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-admin-email">
                      admin@ulavarangadi.com
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-about-us">
                  About Ulavar Angadi
                </span>
              </li>
              <li>
                <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-social-responsibility">
                  Farmer Stories
                </span>
              </li>
              <li>
                <span className="text-muted-foreground px-2 py-1 inline-block" data-testid="text-blog">
                  Organic Farming Tips
                </span>
              </li>
            </ul>
          </div>

          {isCustomer && (
            <div>
              <h4 className="font-semibold mb-4">{t('newsletter')}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {t('getDeals')}
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  name="email"
                  placeholder={t('email')}
                  required
                  className="flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button type="submit" size="icon" data-testid="button-newsletter-submit">
                  <Mail className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FreshHarvest. {t('allRightsReserved')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{t('accept')}:</span>
            <div className="flex items-center gap-2">
              <SiVisa className="h-8 w-auto text-muted-foreground" />
              <SiMastercard className="h-8 w-auto text-muted-foreground" />
              <div className="px-2 py-1 border rounded text-xs font-semibold text-muted-foreground">UPI</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
