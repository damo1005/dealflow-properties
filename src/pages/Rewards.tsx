import { Award, Gift, History, Star, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRewardsStore } from '@/stores/rewardsStore';
import { TIER_BENEFITS, EARN_ACTIONS, RewardTier } from '@/types/rewards';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const tierColors: Record<RewardTier, string> = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
};

const tierIcons: Record<RewardTier, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

export default function Rewards() {
  const { account, offers, transactions, redeemOffer, getTierProgress } = useRewardsStore();
  const tierProgress = getTierProgress();

  const handleRedeem = (offerId: string, title: string, cost: number) => {
    if (!account || account.points_balance < cost) {
      toast.error('Not enough points');
      return;
    }
    redeemOffer(offerId);
    toast.success(`Redeemed: ${title}`);
  };

  const canRedeem = (offer: typeof offers[0]) => {
    if (!account) return false;
    if (account.points_balance < offer.points_cost) return false;
    const tiers: RewardTier[] = ['bronze', 'silver', 'gold', 'platinum'];
    const userTierIndex = tiers.indexOf(account.tier);
    const requiredTierIndex = tiers.indexOf(offer.min_tier);
    return userTierIndex >= requiredTierIndex;
  };

  if (!account) return null;

  return (
    <AppLayout title="Rewards">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Landlord Rewards
          </h1>
          <p className="text-muted-foreground">Earn points and unlock exclusive benefits</p>
        </div>

        {/* Points Overview */}
        <Card className={cn("overflow-hidden bg-gradient-to-br", tierColors[account.tier])}>
          <CardContent className="pt-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{tierIcons[account.tier]}</span>
                  <span className="text-xl font-bold uppercase">{account.tier} Member</span>
                </div>
                <div className="text-5xl font-bold mb-2">
                  {account.points_balance.toLocaleString()}
                  <span className="text-lg font-normal ml-2">points</span>
                </div>
                {tierProgress.next && (
                  <div className="mt-4 max-w-xs">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{tierProgress.pointsNeeded} points to {tierProgress.next}</span>
                      <span>{Math.round(tierProgress.progress)}%</span>
                    </div>
                    <Progress value={tierProgress.progress} className="h-2 bg-white/30" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                <Flame className="h-5 w-5" />
                <div>
                  <div className="text-2xl font-bold">{account.login_streak_days}</div>
                  <div className="text-xs">day streak</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="redeem" className="space-y-6">
          <TabsList>
            <TabsTrigger value="redeem">Redeem Points</TabsTrigger>
            <TabsTrigger value="earn">How to Earn</TabsTrigger>
            <TabsTrigger value="tiers">Tier Benefits</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="redeem" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => {
                const canUserRedeem = canRedeem(offer);
                const tiers: RewardTier[] = ['bronze', 'silver', 'gold', 'platinum'];
                const isHigherTier = tiers.indexOf(offer.min_tier) > tiers.indexOf(account.tier);

                return (
                  <Card key={offer.id} className={cn(!canUserRedeem && "opacity-70")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{offer.title}</CardTitle>
                          <CardDescription>{offer.description}</CardDescription>
                        </div>
                        <Gift className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-muted-foreground">{offer.partner_name}</div>
                        <div className="text-sm font-medium text-primary">{offer.value_description}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{offer.points_cost.toLocaleString()} pts</span>
                        </div>
                        {isHigherTier ? (
                          <Badge variant="secondary">{offer.min_tier}+ only</Badge>
                        ) : (
                          <Button
                            size="sm"
                            disabled={!canUserRedeem}
                            onClick={() => handleRedeem(offer.id, offer.title, offer.points_cost)}
                          >
                            Redeem
                          </Button>
                        )}
                      </div>
                      {offer.stock_remaining !== null && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {offer.stock_remaining} remaining
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="earn">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ways to Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {EARN_ACTIONS.map((action, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span>{action.action}</span>
                      <Badge variant="secondary">
                        +{action.points} pts{action.note && ` ${action.note}`}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.entries(TIER_BENEFITS) as [RewardTier, string[]][]).map(([tier, benefits]) => (
                <Card 
                  key={tier} 
                  className={cn(
                    "relative overflow-hidden",
                    tier === account.tier && "ring-2 ring-primary"
                  )}
                >
                  <div className={cn("h-2 bg-gradient-to-r", tierColors[tier])} />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{tierIcons[tier]}</span>
                      <span className="capitalize">{tier}</span>
                      {tier === account.tier && (
                        <Badge variant="secondary" className="ml-auto">Current</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Points History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <div className="font-medium">{tx.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(tx.created_at), 'd MMM yyyy')}
                        </div>
                      </div>
                      <Badge variant={tx.points > 0 ? 'default' : 'destructive'}>
                        {tx.points > 0 ? '+' : ''}{tx.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
