import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface AgentProfile {
  id: string;
  userId: string;
  agentName: string;
  companyName?: string;
  serviceArea?: string;
  commissionRate: string;
  totalSales: number;
  totalEarnings: string;
}

interface AgentSaleData {
  totalSales: number;
  totalCommission: string;
  totalPaid: string;
  pendingCommission: string;
}

export default function AgentDashboard() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    agentName: "",
    companyName: "",
    serviceArea: "",
    commissionRate: "5.00",
    bio: "",
  });

  const { data: profile } = useQuery({
    queryKey: ["/api/agent/profile"],
    queryFn: async () => {
      const res = await fetch("/api/agent/profile");
      return res.json();
    },
  });

  const { data: sales } = useQuery<AgentSaleData>({
    queryKey: ["/api/agent/sales"],
    queryFn: async () => {
      const res = await fetch("/api/agent/sales");
      return res.json();
    },
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ["/api/agent/farmers"],
    queryFn: async () => {
      const res = await fetch("/api/agent/farmers");
      return res.json();
    },
  });

  const profileMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/agent/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error("Failed to create profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/profile"] });
      setOpenDialog(false);
      toast({ title: "Success", description: "Profile created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={0} />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to Agent Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Create your agent profile to start earning commissions
            </p>

            <div className="space-y-4">
              <Input
                placeholder="Agent Name"
                value={profileData.agentName}
                onChange={(e) => setProfileData({ ...profileData, agentName: e.target.value })}
                data-testid="input-agent-name"
              />
              <Input
                placeholder="Company Name"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                data-testid="input-company-name"
              />
              <Input
                placeholder="Service Area"
                value={profileData.serviceArea}
                onChange={(e) => setProfileData({ ...profileData, serviceArea: e.target.value })}
                data-testid="input-service-area"
              />
              <Input
                placeholder="Commission Rate (%)"
                type="number"
                value={profileData.commissionRate}
                onChange={(e) => setProfileData({ ...profileData, commissionRate: e.target.value })}
                data-testid="input-commission-rate"
              />
              <Button
                onClick={() => profileMutation.mutate()}
                disabled={profileMutation.isPending}
                className="w-full"
                data-testid="button-create-profile"
              >
                Create Profile
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{profile.agentName}</h1>
          <p className="text-muted-foreground">{profile.companyName}</p>
        </div>

        {/* Sales Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-3xl font-bold">{sales?.totalSales || 0}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Total Commission</p>
            <p className="text-3xl font-bold">₹{sales?.totalCommission || "0"}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-3xl font-bold">₹{sales?.totalPaid || "0"}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending: ₹{sales?.pendingCommission || "0"}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Commission Rate</p>
            <p className="text-3xl font-bold">{profile.commissionRate}%</p>
          </Card>
        </div>

        {/* Connected Farmers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Connected Farmers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmers.map((relation: any) => (
              <Card key={relation.agent_farmer_relations.id} className="p-4" data-testid={`card-farmer-${relation.agent_farmer_relations.farmerId}`}>
                <h3 className="font-semibold mb-2">{relation.farmer_profiles.farmName}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Area: {relation.farmer_profiles.farmArea}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Products Sold: {relation.farmer_profiles.totalProductsSold}
                </p>
                <p className="text-sm">
                  Earnings: ₹{relation.farmer_profiles.earnings}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Area Info */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Your Service Area</h2>
          <p className="text-lg">{profile.serviceArea || "Not specified"}</p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
