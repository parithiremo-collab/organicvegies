import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Mail } from "lucide-react";
import { SiVisa, SiMastercard } from "react-icons/si";
import { Link } from "wouter";

interface FooterProps {
  onNewsletterSubmit?: (email: string) => void;
}

export default function Footer({ onNewsletterSubmit }: FooterProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    onNewsletterSubmit?.(email);
  };

  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-accent text-xl font-bold text-primary mb-4">FreshHarvest</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fresh organic produce delivered directly from certified farmers to your doorstep.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>100% Organic Certified</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-help">
                    Help Center
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/track-order">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-track-order">
                    Track Order
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-shipping">
                    Shipping Info
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-returns">
                    Returns & Refunds
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-privacy">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-terms">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/quality">
                  <a className="text-muted-foreground hover:text-foreground hover-elevate px-2 py-1 rounded-md inline-block" data-testid="link-quality">
                    Quality Guarantee
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get fresh deals and organic tips delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button type="submit" size="icon" data-testid="button-newsletter-submit">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FreshHarvest. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">We accept:</span>
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
