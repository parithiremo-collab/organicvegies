import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useQuery } from "@tanstack/react-query";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import UnifiedLogin from "@/pages/UnifiedLogin";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import FarmerDashboard from "@/pages/FarmerDashboard";
import AgentDashboard from "@/pages/AgentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import RedirectToHome from "@/pages/redirect-to-home";

interface UserData {
  role: string;
}

function Router() {
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={UnifiedLogin} />
          <Route component={RedirectToHome} />
        </>
      ) : (
        <>
          {user?.role === "superadmin" ? (
            <>
              <Route path="/" component={SuperAdminDashboard} />
              <Route component={RedirectToHome} />
            </>
          ) : user?.role === "admin" ? (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route component={RedirectToHome} />
            </>
          ) : user?.role === "farmer" ? (
            <>
              <Route path="/" component={FarmerDashboard} />
              <Route component={RedirectToHome} />
            </>
          ) : user?.role === "agent" ? (
            <>
              <Route path="/" component={AgentDashboard} />
              <Route component={RedirectToHome} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/shop" component={Shop} />
              <Route path="/products/:id" component={ProductDetail} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/orders" component={Orders} />
              <Route path="/orders/:id" component={OrderDetail} />
              <Route component={RedirectToHome} />
            </>
          )}
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
