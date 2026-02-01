import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { subMonths, format } from "date-fns";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  time: string;
  entityType: string | null;
  entityId: string | null;
}

interface DashboardStats {
  propertiesSaved: number;
  propertiesLastMonth: number;
  activeAlerts: number;
  alertsTriggeredToday: number;
  dealsInPipeline: number;
  dealsInNegotiation: number;
  propertiesOverTime: { month: string; properties: number }[];
  recentActivity: ActivityItem[];
}

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user) {
        return getEmptyStats();
      }

      const now = new Date();

      // Fetch pipeline properties count
      const { count: pipelineCount } = await supabase
        .from('pipeline_properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch pipeline properties in negotiation
      const { count: negotiationCount } = await supabase
        .from('pipeline_properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('stage', 'negotiation');

      // Fetch deal scouts (as proxy for active alerts)
      const { count: scoutCount } = await supabase
        .from('deal_scouts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Fetch scout discoveries today
      const today = new Date().toISOString().split('T')[0];
      const { count: discoveriesCount } = await supabase
        .from('scout_discoveries')
        .select('id', { count: 'exact', head: true })
        .gte('discovered_at', today);

      // Fetch properties over time
      const { data: propertiesData } = await supabase
        .from('pipeline_properties')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', subMonths(now, 12).toISOString())
        .order('created_at', { ascending: true });

      // Process properties over time
      const monthlyData: Record<string, number> = {};
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(now, 11 - i);
        return format(date, 'MMM');
      });
      
      last12Months.forEach(month => {
        monthlyData[month] = 0;
      });

      if (propertiesData) {
        propertiesData.forEach((property) => {
          const month = format(new Date(property.created_at), 'MMM');
          if (monthlyData[month] !== undefined) {
            monthlyData[month]++;
          }
        });
      }

      const propertiesOverTime = last12Months.map(month => ({
        month,
        properties: monthlyData[month] || 0
      }));

      // Fetch recent activity using type assertion for new table
      const { data: activityData } = await (supabase as any)
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const recentActivity: ActivityItem[] = (activityData || []).map((activity: any) => ({
        id: activity.id,
        type: activity.activity_type,
        title: activity.title,
        description: activity.description,
        time: activity.created_at,
        entityType: activity.entity_type,
        entityId: activity.entity_id
      }));

      return {
        propertiesSaved: pipelineCount || 0,
        propertiesLastMonth: 0, // Would need additional query
        activeAlerts: scoutCount || 0,
        alertsTriggeredToday: discoveriesCount || 0,
        dealsInPipeline: pipelineCount || 0,
        dealsInNegotiation: negotiationCount || 0,
        propertiesOverTime,
        recentActivity
      };
    },
    enabled: !!user,
    staleTime: 30000,
    refetchInterval: 60000
  });
}

function getEmptyStats(): DashboardStats {
  return {
    propertiesSaved: 0,
    propertiesLastMonth: 0,
    activeAlerts: 0,
    alertsTriggeredToday: 0,
    dealsInPipeline: 0,
    dealsInNegotiation: 0,
    propertiesOverTime: [],
    recentActivity: []
  };
}
