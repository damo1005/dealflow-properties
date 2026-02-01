import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNetworkStore } from "@/stores/networkStore";
import { SPECIALTIES } from "@/types/network";
import {
  Search,
  MapPin,
  Building2,
  TrendingUp,
  MessageCircle,
  UserPlus,
  Check,
} from "lucide-react";

export function NetworkPeople() {
  const { profiles, connections, addConnection, removeConnection } = useNetworkStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [openToJV, setOpenToJV] = useState(false);

  const isFollowing = (userId: string) => 
    connections.some((c) => c.following_id === userId && c.follower_id === "user1");

  const toggleFollow = (userId: string) => {
    if (isFollowing(userId)) {
      removeConnection(userId);
    } else {
      addConnection({
        id: crypto.randomUUID(),
        follower_id: "user1",
        following_id: userId,
        connection_type: "follow",
        created_at: new Date().toISOString(),
      });
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const filteredProfiles = profiles.filter((profile) => {
    // Skip current user
    if (profile.user_id === "user1") return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = profile.display_name?.toLowerCase().includes(query);
      const matchesCity = profile.location_city?.toLowerCase().includes(query);
      const matchesBio = profile.bio?.toLowerCase().includes(query);
      if (!matchesName && !matchesCity && !matchesBio) return false;
    }

    // Specialty filter
    if (selectedSpecialties.length > 0) {
      const hasSpecialty = selectedSpecialties.some((s) =>
        profile.specialties.includes(s)
      );
      if (!hasSpecialty) return false;
    }

    // JV filter
    if (openToJV && !profile.open_to_jv) return false;

    return true;
  });

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <Card className="w-64 shrink-0 hidden lg:block h-fit sticky top-20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Specialties */}
          <div className="space-y-3">
            <Label>Specialties</Label>
            <div className="space-y-2">
              {SPECIALTIES.slice(0, 5).map((specialty) => (
                <div key={specialty} className="flex items-center gap-2">
                  <Checkbox
                    id={`specialty-${specialty}`}
                    checked={selectedSpecialties.includes(specialty)}
                    onCheckedChange={() => toggleSpecialty(specialty)}
                  />
                  <label
                    htmlFor={`specialty-${specialty}`}
                    className="text-sm cursor-pointer"
                  >
                    {specialty}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* JV Filter */}
          <div className="space-y-3">
            <Label>Availability</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="open-jv"
                checked={openToJV}
                onCheckedChange={(checked) => setOpenToJV(!!checked)}
              />
              <label htmlFor="open-jv" className="text-sm cursor-pointer">
                Open to JV
              </label>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSearchQuery("");
              setSelectedSpecialties([]);
              setOpenToJV(false);
            }}
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {/* People Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            {filteredProfiles.length} investor{filteredProfiles.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Cover */}
              <div className="h-16 bg-gradient-to-r from-primary/20 to-primary/5" />

              <CardContent className="pt-0 -mt-8">
                {/* Avatar */}
                <Avatar className="h-16 w-16 border-4 border-background">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {profile.display_name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="mt-3 space-y-2">
                  <div>
                    <h3 className="font-semibold">{profile.display_name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.specialties.join(" • ")}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.location_city}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span>{profile.properties_count} properties</span>
                    </div>
                    {profile.portfolio_yield && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span>{profile.portfolio_yield}% yield</span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1">
                    {profile.open_to_jv && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Open to JV
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">
                      {profile.investor_type}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={isFollowing(profile.user_id) ? "secondary" : "default"}
                      className="flex-1"
                      onClick={() => toggleFollow(profile.user_id)}
                    >
                      {isFollowing(profile.user_id) ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No investors found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
