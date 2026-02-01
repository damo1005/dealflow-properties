import { TrendingUp, Home, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { MarketData } from '@/types/marketIntel';

interface InvestmentScoreCardProps {
  marketData: MarketData;
}

export function InvestmentScoreCard({ marketData }: InvestmentScoreCardProps) {
  const scores = [
    {
      label: 'BTL Suitability',
      score: marketData.btl_score || 0,
      icon: Home,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
    },
    {
      label: 'HMO Potential',
      score: marketData.hmo_score || 0,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
    },
    {
      label: 'Growth Potential',
      score: marketData.growth_score || 0,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
    },
  ];

  const getStars = (score: number) => {
    const starCount = Math.round(score / 20);
    return Array.from({ length: 5 }, (_, i) => i < starCount);
  };

  const overallScore = marketData.overall_investment_score || 0;
  const overallRating = overallScore >= 80 ? 'Excellent' : 
                        overallScore >= 60 ? 'Good' : 
                        overallScore >= 40 ? 'Fair' : 'Poor';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Investment Scores
          <span className="text-2xl font-bold text-primary">{overallScore}/100</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Overall Rating: <span className="font-medium text-foreground">{overallRating}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {scores.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{item.score}</span>
                <div className="flex">
                  {getStars(item.score).map((filled, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${filled ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Progress value={item.score} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
