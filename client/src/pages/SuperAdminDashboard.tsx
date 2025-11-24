import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { TrendingUp, Users, Settings, LogOut } from "lucide-react";

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["/api/superadmin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/superadmin/stats");
      return res.json();
    },
  });

  const { data: admins = [] } = useQuery({
    queryKey: ["/api/superadmin/admins"],
    queryFn: async () => {
      const res = await fetch("/api/superadmin/admins");
      return res.json();
    },
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ["/api/superadmin/audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/superadmin/audit-logs?limit=20");
      return res.json();
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });
      if (!res.ok) throw new Error("Failed to create admin");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/admins"] });
      setAdminEmail("");
      setOpenDialog(false);
      toast({ title: "Success", description: "Admin created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (adminId: string) => {
      const res = await fetch(`/api/superadmin/admins/${adminId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove admin");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/admins"] });
      toast({ title: "Success", description: "Admin removed" });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-4xl font-bold mb-8">Super Admin Dashboard</h1>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Admins</p>
                <p className="text-3xl font-bold">{stats?.activeAdmins || 0}</p>
              </div>
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform Revenue</p>
                <p className="text-3xl font-bold">₹{stats?.totalRevenue || "0"}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Farmers</p>
                <p className="text-3xl font-bold">{stats?.totalFarmers || 0}</p>
              </div>
              <LogOut className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="admins" className="w-full" data-testid="tabs-superadmin">
          <TabsList className="grid w-full grid-cols-2" data-testid="tabs-list-superadmin">
            <TabsTrigger value="admins" data-testid="tab-admins">Admin Management</TabsTrigger>
            <TabsTrigger value="audit" data-testid="tab-audit">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Admins Tab */}
          <TabsContent value="admins" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Admins</h2>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-admin">Create Admin</Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-create-admin">
                  <DialogHeader>
                    <DialogTitle>Create New Admin</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Admin Email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      data-testid="input-admin-email"
                    />
                    <Button
                      onClick={() => createAdminMutation.mutate()}
                      disabled={createAdminMutation.isPending}
                      className="w-full"
                      data-testid="button-submit-admin"
                    >
                      Create Admin
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admins.map((admin: any) => (
                <Card key={admin.id} className="p-4" data-testid={`card-admin-${admin.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{admin.adminName}</h3>
                      <p className="text-sm text-muted-foreground">{admin.department}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAdminMutation.mutate(admin.userId)}
                      disabled={removeAdminMutation.isPending}
                      data-testid={`button-remove-admin-${admin.id}`}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Status: {admin.isActive ? "Active" : "Inactive"}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log: any) => (
                <Card key={log.id} className="p-3" data-testid={`card-audit-${log.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.targetType} - {log.targetId}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
