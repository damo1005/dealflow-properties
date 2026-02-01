import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNetworkStore } from "@/stores/networkStore";
import {
  Search,
  Users,
  MapPin,
  Plus,
  Check,
  TrendingUp,
} from "lucide-react";

export function NetworkGroups() {
  const { groups } = useNetworkStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<string[]>(["g1"]);

  const isJoined = (groupId: string) => joinedGroups.includes(groupId);

  const toggleJoin = (groupId: string) => {
    setJoinedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const filteredGroups = groups.filter((group) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(query) ||
      group.description?.toLowerCase().includes(query)
    );
  });

  const locationGroups = filteredGroups.filter((g) => g.group_type === "location_based");
  const strategyGroups = filteredGroups.filter((g) => g.group_type === "strategy_based");

  const getGroupIcon = (type: string | null) => {
    if (type === "location_based") return <MapPin className="h-5 w-5" />;
    if (type === "strategy_based") return <TrendingUp className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Create Group
        </Button>
      </div>

      {/* My Groups */}
      {joinedGroups.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">My Groups</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups
              .filter((g) => joinedGroups.includes(g.id))
              .map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getGroupIcon(group.group_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{group.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {group.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {group.member_count.toLocaleString()}
                          </Badge>
                          {group.location_area && (
                            <Badge variant="secondary" className="text-xs">
                              {group.location_area}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Location-Based Groups */}
      {locationGroups.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location-Based Groups
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locationGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{group.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {group.member_count.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={isJoined(group.id) ? "secondary" : "default"}
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => toggleJoin(group.id)}
                  >
                    {isJoined(group.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Joined
                      </>
                    ) : (
                      "Join Group"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Strategy-Based Groups */}
      {strategyGroups.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Strategy-Based Groups
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{group.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {group.member_count.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={isJoined(group.id) ? "secondary" : "default"}
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => toggleJoin(group.id)}
                  >
                    {isJoined(group.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Joined
                      </>
                    ) : (
                      "Join Group"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
