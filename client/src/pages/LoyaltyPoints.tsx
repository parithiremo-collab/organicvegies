import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function LoyaltyPoints() {
  const { data: points, isLoading } = useQuery({
    queryKey: ["/api/loyalty/points"],
    queryFn: () =>
      apiRequest("/api/loyalty/points").then((r) => r.json().catch(() => ({
        totalPoints: 0,
        balance: 0,
        tier: "Bronze",
        rewardsHistory: []
      }))),
  });

  const rewards = [
    { points: 100, reward: "₹10 Discount", icon: Gift },
    { points: 500, reward: "₹60 Discount", icon: TrendingUp },
    { points: 1000, reward: "Free Delivery (1 month)", icon: Zap },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-loyalty">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Points Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 border bg-gradient-to-br from-primary/10 to-primary/5" data-testid="card-total-points">
              <p className="text-muted-foreground mb-2">Total Points Earned</p>
              <p className="text-4xl font-bold text-primary mb-1">{points?.totalPoints || 0}</p>
            </Card>

            <Card className="p-8 border bg-gradient-to-br from-secondary/10 to-secondary/5" data-testid="card-balance">
              <p className="text-muted-foreground mb-2">Available Balance</p>
              <p className="text-4xl font-bold text-secondary mb-1">{points?.balance || 0}</p>
            </Card>

            <Card className="p-8 border" data-testid="card-tier">
              <p className="text-muted-foreground mb-2">Your Tier</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{points?.tier || 'Bronze'}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Level up with more purchases</p>
            </Card>
          </div>

          {/* How to Earn */}
          <Card className="p-8 border" data-testid="card-earn-points">
            <h2 className="text-2xl font-bold mb-6">How to Earn Points</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-primary/20 text-primary w-10 h-10 rounded flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold">Every Purchase</p>
                  <p className="text-sm text-muted-foreground">Earn 1 point for every ₹10 spent</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-primary/20 text-primary w-10 h-10 rounded flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold">Write Reviews</p>
                  <p className="text-sm text-muted-foreground">Get 5 bonus points per verified review</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 text-primary w-10 h-10 rounded flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold">Referrals</p>
                  <p className="text-sm text-muted-foreground">Earn 50 points when friend makes first purchase</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Rewards */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewards.map((reward, idx) => {
                const Icon = reward.icon;
                const canRedeem = (points?.balance || 0) >= reward.points;
                return (
                  <Card key={idx} className="p-6 border" data-testid={`card-reward-${idx}`}>
                    <div className="bg-primary/10 w-12 h-12 rounded flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-lg mb-2">{reward.reward}</p>
                    <p className="text-sm text-muted-foreground mb-4">{reward.points} points</p>
                    <Button
                      className="w-full"
                      disabled={!canRedeem}
                      data-testid={`button-redeem-${idx}`}
                    >
                      {canRedeem ? 'Redeem' : 'Not Enough Points'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
