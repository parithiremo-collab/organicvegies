import { ShoppingCart, User, Search, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n/useTranslation";

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
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Determine if user is a seller/farmer or agent/admin
  const isSeller = user?.role === "farmer";
  const isAgent = user?.role === "agent";
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isCustomer = user?.role === "customer";
  
  // Get role label for display
  const getRoleLabel = () => {
    switch(user?.role) {
      case "farmer": return "Farmer";
      case "agent": return "Agent";
      case "admin": return "Admin";
      case "superadmin": return "Super Admin";
      default: return "Customer";
    }
  };

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
                  <Link href="/" className="text-base font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-home-mobile">
                    {isCustomer ? t('home') : "Dashboard"}
                  </Link>
                  {isCustomer && (
                    <>
                      <Link href="/orders" className="text-base font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-orders-mobile">
                        {t('orders')}
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1" data-testid="link-logo">
              <img src="/ulavar-angadi-logo.png" alt="Ulavar Angadi Logo" className="h-12 object-contain" />
              <span className="hidden sm:inline font-semibold text-lg text-primary">Ulavar Angadi</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {isCustomer && (
                <>
                  <Link href="/" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-browse">
                    Browse
                  </Link>
                  <Link href="/orders" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-orders">
                    {t('orders')}
                  </Link>
                </>
              )}
              {(isSeller || isAgent || isAdmin) && (
                <span className="text-sm font-semibold px-3 py-2 bg-primary/10 rounded-md text-primary" data-testid="text-role">
                  {getRoleLabel()}
                </span>
              )}
            </nav>
          </div>

          {isCustomer && (
            <div className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('search')}
                  className="w-full pl-10"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {isCustomer && (
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
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-profile">
                  <Avatar className="h-5 w-5">
                    {user?.profileImageUrl && (
                      <AvatarImage src={user.profileImageUrl} alt={user.firstName || "User"} />
                    )}
                    <AvatarFallback className="text-xs">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium" data-testid="text-user-name">
                    {user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="text-user-email">
                    {user?.email}
                  </p>
                  <p className="text-xs text-primary font-semibold" data-testid="text-user-role">
                    {getRoleLabel()}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {isCustomer && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" data-testid="link-my-orders">
                        {t('orders')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/checkout" data-testid="link-checkout">
                        Checkout
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <a href="/api/logout" data-testid="button-logout" className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    {t('logout')}
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isCustomer && (
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search')}
                className="w-full pl-10"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                data-testid="input-search-mobile"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
