import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, ShoppingCart, Users, Shield, Crown } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface RoleOption {
  role: string;
  titleKey: string;
  descKey: string;
  icon: any;
  color: string;
}

const ROLES: RoleOption[] = [
  {
    role: "customer",
    titleKey: "roleCustomer",
    descKey: "roleCustomerDesc",
    icon: ShoppingCart,
    color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  },
  {
    role: "seller",
    titleKey: "roleFarmer",
    descKey: "roleFarmerDesc",
    icon: Leaf,
    color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  },
  {
    role: "agent",
    titleKey: "roleAgent",
    descKey: "roleAgentDesc",
    icon: Users,
    color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
  },
  {
    role: "admin",
    titleKey: "roleAdmin",
    descKey: "roleAdminDesc",
    icon: Shield,
    color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
  },
  {
    role: "superadmin",
    titleKey: "roleSuperAdmin",
    descKey: "roleSuperAdminDesc",
    icon: Crown,
    color: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  },
];

export default function UnifiedLogin() {
  const { t } = useTranslation();

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
            {t("loginPageTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t("loginPageSubtitle")}
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
                      <h3 className="text-lg font-bold">{t(role.titleKey)}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(role.descKey)}
                    </p>
                  </div>

                  {/* Login Button */}
                  <Button
                    onClick={handleLogin}
                    className="w-full"
                    data-testid={`button-login-${role.role}`}
                  >
                    {t("loginAs")} {t(role.titleKey)}
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
              <p className="text-muted-foreground">{t("organicProducts")}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Direct</div>
              <p className="text-muted-foreground">{t("farmToTable")}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Fast</div>
              <p className="text-muted-foreground">{t("fastDelivery")}</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t("loginNote")}</p>
        </div>
      </div>
    </div>
  );
}
