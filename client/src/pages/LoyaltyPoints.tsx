import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, TrendingUp, Zap } from "lucide-react";
import { Loader } from "lucide-react";

export default function LoyaltyPoints() {
  const [selectedReward, setSelectedReward] = useState<any>(null);

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
    { id: 1, points: 100, reward: "₹10 Discount", icon: Gift, description: "Get ₹10 off on your next purchase of any organic products" },
    { id: 2, points: 500, reward: "₹60 Discount", icon: TrendingUp, description: "Get ₹60 off on any order, no minimum purchase required" },
    { id: 3, points: 1000, reward: "Free Delivery (1 month)", icon: Zap, description: "Enjoy free delivery on all orders for the next 30 days" },
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
              {rewards.map((reward) => {
                const Icon = reward.icon;
                const canRedeem = (points?.balance || 0) >= reward.points;
                return (
                  <Card 
                    key={reward.id} 
                    className="p-6 border cursor-pointer hover-elevate"
                    onClick={() => setSelectedReward(reward)}
                    data-testid={`card-reward-${reward.id}`}
                  >
                    <div className="bg-primary/10 w-12 h-12 rounded flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-lg mb-2">{reward.reward}</p>
                    <p className="text-sm text-muted-foreground mb-4">{reward.points} points</p>
                    <Button
                      className="w-full"
                      disabled={!canRedeem}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReward(reward);
                      }}
                      data-testid={`button-redeem-${reward.id}`}
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

      {/* Reward Details Modal */}
      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent data-testid="modal-reward-details">
          <DialogHeader>
            <DialogTitle>{selectedReward?.reward}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-primary/10 w-16 h-16 rounded flex items-center justify-center">
              {selectedReward && <selectedReward.icon className="w-8 h-8 text-primary" />}
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Points Required</p>
                <p className="text-3xl font-bold">{selectedReward?.points}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Your Balance</p>
                <p className="text-3xl font-bold text-primary">{points?.balance || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base">{selectedReward?.description}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                className="flex-1"
                disabled={(points?.balance || 0) < (selectedReward?.points || 0)}
                data-testid="button-confirm-redeem"
              >
                Redeem Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedReward(null)}
                data-testid="button-close-reward-modal"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
