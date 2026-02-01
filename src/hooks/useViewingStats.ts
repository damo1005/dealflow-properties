import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt?: string;
}

interface ViewingStats {
  totalViewings: number;
  totalMinutesRecorded: number;
  streakDays: number;
  badgesEarned: Badge[];
  lastViewingDate: string | null;
}

const BADGE_DEFINITIONS: Record<string, { name: string; description: string }> = {
  first_viewing: {
    name: "First Viewing",
    description: "You've recorded your first property viewing!",
  },
  ten_viewings: {
    name: "Property Pro",
    description: "Recorded 10 property viewings!",
  },
  detailed_viewer: {
    name: "Detail Master",
    description: "Recorded a thorough viewing (10+ minutes)",
  },
  template_pro: {
    name: "Template Pro",
    description: "Used all 5 viewing templates",
  },
  streak_7: {
    name: "Week Warrior",
    description: "7-day viewing streak!",
  },
  fifty_viewings: {
    name: "Viewing Expert",
    description: "Recorded 50 property viewings!",
  },
};

export function useViewingStats() {
  const [stats, setStats] = useState<ViewingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchStats = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_viewing_stats")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        const badgesWithDetails = (data.badges_earned as string[] || []).map(
          (badgeId) => ({
            id: badgeId,
            ...BADGE_DEFINITIONS[badgeId],
          })
        );

        setStats({
          totalViewings: data.total_viewings || 0,
          totalMinutesRecorded: data.total_minutes_recorded || 0,
          streakDays: data.streak_days || 0,
          badgesEarned: badgesWithDetails,
          lastViewingDate: data.last_viewing_date,
        });
      } else {
        setStats({
          totalViewings: 0,
          totalMinutesRecorded: 0,
          streakDays: 0,
          badgesEarned: [],
          lastViewingDate: null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch viewing stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStats = useCallback(
    async (
      userId: string,
      durationSeconds: number,
      templateUsed?: string
    ): Promise<Badge[]> => {
      const newBadges: Badge[] = [];

      try {
        // Fetch current stats
        const { data: currentStats } = await supabase
          .from("user_viewing_stats")
          .select("*")
          .eq("user_id", userId)
          .single();

        const existingBadges = (currentStats?.badges_earned as string[]) || [];
        const newViewings = (currentStats?.total_viewings || 0) + 1;
        const newMinutes =
          (currentStats?.total_minutes_recorded || 0) +
          Math.floor(durationSeconds / 60);

        // Calculate streak
        let newStreak = currentStats?.streak_days || 0;
        const lastViewing = currentStats?.last_viewing_date
          ? new Date(currentStats.last_viewing_date)
          : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (lastViewing) {
          const lastViewingDay = new Date(lastViewing);
          lastViewingDay.setHours(0, 0, 0, 0);
          const dayDiff = Math.floor(
            (today.getTime() - lastViewingDay.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (dayDiff === 1) {
            newStreak += 1;
          } else if (dayDiff > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        // Check for new badges
        const updatedBadges = [...existingBadges];

        // First viewing badge
        if (newViewings === 1 && !existingBadges.includes("first_viewing")) {
          updatedBadges.push("first_viewing");
          newBadges.push({
            id: "first_viewing",
            ...BADGE_DEFINITIONS.first_viewing,
          });
        }

        // 10 viewings badge
        if (newViewings >= 10 && !existingBadges.includes("ten_viewings")) {
          updatedBadges.push("ten_viewings");
          newBadges.push({
            id: "ten_viewings",
            ...BADGE_DEFINITIONS.ten_viewings,
          });
        }

        // 50 viewings badge
        if (newViewings >= 50 && !existingBadges.includes("fifty_viewings")) {
          updatedBadges.push("fifty_viewings");
          newBadges.push({
            id: "fifty_viewings",
            ...BADGE_DEFINITIONS.fifty_viewings,
          });
        }

        // Detailed viewer badge (10+ minutes)
        if (
          durationSeconds >= 600 &&
          !existingBadges.includes("detailed_viewer")
        ) {
          updatedBadges.push("detailed_viewer");
          newBadges.push({
            id: "detailed_viewer",
            ...BADGE_DEFINITIONS.detailed_viewer,
          });
        }

        // Week streak badge
        if (newStreak >= 7 && !existingBadges.includes("streak_7")) {
          updatedBadges.push("streak_7");
          newBadges.push({
            id: "streak_7",
            ...BADGE_DEFINITIONS.streak_7,
          });
        }

        // Upsert stats
        const { error } = await supabase.from("user_viewing_stats").upsert(
          {
            user_id: userId,
            total_viewings: newViewings,
            total_minutes_recorded: newMinutes,
            last_viewing_date: new Date().toISOString(),
            streak_days: newStreak,
            badges_earned: updatedBadges,
          },
          { onConflict: "user_id" }
        );

        if (error) throw error;

        // Show badge notifications
        newBadges.forEach((badge) => {
          toast({
            title: `🎉 Badge Unlocked!`,
            description: `${badge.name} - ${badge.description}`,
          });
        });

        return newBadges;
      } catch (error) {
        console.error("Failed to update viewing stats:", error);
        return [];
      }
    },
    [toast]
  );

  return {
    stats,
    isLoading,
    fetchStats,
    updateStats,
  };
}
