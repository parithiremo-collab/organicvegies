import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "wouter";

const TEST_ROLES = [
  { role: "customer", label: "🛒 Customer", color: "bg-blue-50 dark:bg-blue-950" },
  { role: "farmer", label: "👨‍🌾 Farmer", color: "bg-green-50 dark:bg-green-950" },
  { role: "agent", label: "🤝 Agent", color: "bg-amber-50 dark:bg-amber-950" },
  { role: "admin", label: "👨‍💼 Admin", color: "bg-purple-50 dark:bg-purple-950" },
  { role: "superadmin", label: "👑 Super Admin", color: "bg-red-50 dark:bg-red-950" },
];

export default function TestLogin() {
  const [loading, setLoading] = useState<string | null>(null);
  const [, navigate] = useNavigate();

  const handleLogin = async (role: string) => {
    setLoading(role);
    try {
      const response = await fetch(`/api/test/login/${role}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log(`✅ Logged in as ${role}`);
        // Refresh to see the new dashboard
        window.location.href = "/";
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">🧪 Test Login</h1>
          <p className="text-lg text-muted-foreground">
            Development Mode - Click a role to login instantly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {TEST_ROLES.map((item) => (
            <Card
              key={item.role}
              className={`${item.color} border-2 overflow-hidden hover:shadow-lg transition-all`}
            >
              <div className="p-4 flex flex-col items-center gap-4">
                <div className="text-3xl">{item.label.split(" ")[0]}</div>
                <div className="text-sm font-semibold text-center">{item.label.split(" ").slice(1).join(" ")}</div>
                <Button
                  onClick={() => handleLogin(item.role)}
                  disabled={loading === item.role}
                  className="w-full"
                  size="sm"
                >
                  {loading === item.role ? "Logging in..." : "Login"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>After clicking login, you'll be redirected to your dashboard</p>
        </div>
      </div>
    </div>
  );
}
