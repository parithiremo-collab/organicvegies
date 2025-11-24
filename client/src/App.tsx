import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Home from "@/pages/Home";
import UnifiedLogin from "@/pages/UnifiedLogin";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import FarmerDashboard from "@/pages/FarmerDashboard";
import AgentDashboard from "@/pages/AgentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import NotFound from "@/pages/not-found";

interface UserData {
  role: string;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: user } = useQuery<UserData>({
    queryKey: ["/api/auth/user"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={UnifiedLogin} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          {user?.role === "superadmin" ? (
            <>
              <Route path="/" component={SuperAdminDashboard} />
              <Route component={NotFound} />
            </>
          ) : user?.role === "admin" ? (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route component={NotFound} />
            </>
          ) : user?.role === "seller" ? (
            <>
              <Route path="/" component={FarmerDashboard} />
              <Route component={NotFound} />
            </>
          ) : user?.role === "agent" ? (
            <>
              <Route path="/" component={AgentDashboard} />
              <Route component={NotFound} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/orders" component={Orders} />
              <Route path="/orders/:id" component={OrderDetail} />
              <Route component={NotFound} />
            </>
          )}
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
