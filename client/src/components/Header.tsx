import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export default function Header({ 
  cartItemCount = 0, 
  onCartClick,
  onSearchChange,
  searchValue = ""
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/">
                    <a className="text-base font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-home-mobile">
                      Home
                    </a>
                  </Link>
                  <Link href="/categories">
                    <a className="text-base font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-categories-mobile">
                      Categories
                    </a>
                  </Link>
                  <Link href="/deals">
                    <a className="text-base font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-deals-mobile">
                      Deals
                    </a>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/">
              <a className="flex items-center gap-2" data-testid="link-logo">
                <div className="font-accent text-2xl font-bold text-primary">FreshHarvest</div>
              </a>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/categories">
                <a className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-categories">
                  Categories
                </a>
              </Link>
              <Link href="/deals">
                <a className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-deals">
                  Deals
                </a>
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for organic vegetables, fruits..."
                className="w-full pl-10"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-profile">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search organic products..."
              className="w-full pl-10"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              data-testid="input-search-mobile"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
