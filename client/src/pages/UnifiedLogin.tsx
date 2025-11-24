import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, ShoppingCart, Users, Shield, Crown } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface RoleOption {
  role: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const ROLES: RoleOption[] = [
  {
    role: "customer",
    title: "🛒 Customer",
    description: "Browse and purchase certified organic products with UPI/Card payments",
    icon: ShoppingCart,
    color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  },
  {
    role: "seller",
    title: "👨‍🌾 Farmer",
    description: "Produce and sell organic products, manage inventory, and track sales",
    icon: Leaf,
    color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  },
  {
    role: "agent",
    title: "🤝 Agent",
    description: "Distribute products and earn commissions on sales facilitated",
    icon: Users,
    color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
  },
  {
    role: "admin",
    title: "👨‍💼 Admin",
    description: "Moderate content and approve farmers and products for the platform",
    icon: Shield,
    color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  },
  {
    role: "superadmin",
    title: "👑 Super Admin",
    description: "Manage the entire platform, admins, and monitor all activities",
    icon: Crown,
    color: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  },
];

export default function UnifiedLogin() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-slate-900">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
            FreshHarvest
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Join India's most trusted organic marketplace. Choose your role and get started.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl w-full">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.role}
                className={`${role.color} border-2 overflow-hidden hover-elevate cursor-pointer transition-all`}
                data-testid={`card-role-${role.role}`}
              >
                <div className="p-6 flex flex-col h-full justify-between">
                  {/* Icon and Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6" />
                      <h3 className="text-lg font-bold">{role.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>

                  {/* Login Button */}
                  <Button
                    onClick={handleLogin}
                    className="w-full"
                    data-testid={`button-login-${role.role}`}
                  >
                    Login as {role.title.split(" ")[1]}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Certified Organic Products</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Direct</div>
              <p className="text-muted-foreground">Farm to Table Supply Chain</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Fast</div>
              <p className="text-muted-foreground">Same-Day Delivery Available</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            All users login with the same credentials via Replit Auth.
            <br />
            Your role determines which dashboard you see.
          </p>
        </div>
      </div>
    </div>
  );
}
