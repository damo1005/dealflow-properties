import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Plus,
  Eye,
  Download,
  Share2,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Search,
  Grid,
  List,
  Palette,
  BarChart3,
  Clock,
  FileCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/types/dealScout";

interface DealPack {
  id: string;
  title: string;
  subtitle?: string;
  pack_type: string;
  status: string;
  view_count: number;
  download_count: number;
  version: number;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  property_data?: {
    address?: string;
    price?: number;
    images?: string[];
  };
}

interface DealPackTemplate {
  id: string;
  name: string;
  description: string;
  template_type: string;
  sections: any[];
  usage_count: number;
  is_system_template: boolean;
  is_default: boolean;
}

export default function DealPacks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("packs");
  const [packs, setPacks] = useState<DealPack[]>([]);
  const [templates, setTemplates] = useState<DealPackTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPacks();
    loadTemplates();
  }, []);

  const loadPacks = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("deal_packs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPacks((data || []) as DealPack[]);
    } catch (error) {
      console.error("Error loading packs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("deal_pack_templates")
        .select("*")
        .order("usage_count", { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as DealPackTemplate[]);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const handleDeletePack = async (pack: DealPack) => {
    try {
      const { error } = await supabase
        .from("deal_packs")
        .delete()
        .eq("id", pack.id);

      if (error) throw error;
      setPacks(packs.filter((p) => p.id !== pack.id));
      toast({ title: "Deal Pack Deleted" });
    } catch (error) {
      console.error("Error deleting pack:", error);
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const filteredPacks = packs.filter((pack) => {
    if (statusFilter !== "all" && pack.status !== statusFilter) return false;
    if (typeFilter !== "all" && pack.pack_type !== typeFilter) return false;
    if (searchQuery && !pack.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Stats
  const totalPacks = packs.length;
  const thisMonthPacks = packs.filter((p) => {
    const created = new Date(p.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  const totalViews = packs.reduce((acc, p) => acc + (p.view_count || 0), 0);
  const totalDownloads = packs.reduce((acc, p) => acc + (p.download_count || 0), 0);

  return (
    <AppLayout title="Deal Packs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Deal Packs
            </h1>
            <p className="text-muted-foreground">
              Professional investment reports in one click
            </p>
          </div>
          <Button onClick={() => navigate("/deal-pack/new")} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Deal Pack
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalPacks}</div>
              <div className="text-sm text-muted-foreground">Total Packs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{thisMonthPacks}</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalViews}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{totalDownloads}</div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="packs" className="gap-2">
              <FileText className="h-4 w-4" />
              My Deal Packs
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileCheck className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="brand" className="gap-2">
              <Palette className="h-4 w-4" />
              Brand Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packs" className="mt-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search packs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="btl">BTL</SelectItem>
                  <SelectItem value="brr">BRR</SelectItem>
                  <SelectItem value="hmo">HMO</SelectItem>
                  <SelectItem value="jv">JV Pitch</SelectItem>
                  <SelectItem value="lender">Lender</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Packs Grid/List */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 bg-muted" />
                    <CardContent className="pt-4">
                      <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPacks.length === 0 ? (
              <EmptyPacksState onCreate={() => navigate("/deal-pack/new")} />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                }
              >
                {filteredPacks.map((pack) => (
                  <DealPackCard
                    key={pack.id}
                    pack={pack}
                    viewMode={viewMode}
                    onView={() => navigate(`/deal-pack/${pack.id}`)}
                    onEdit={() => navigate(`/deal-pack/${pack.id}/edit`)}
                    onDelete={() => handleDeletePack(pack)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <TemplatesTab
              templates={templates}
              onUseTemplate={(template) => navigate(`/deal-pack/new?template=${template.id}`)}
            />
          </TabsContent>

          <TabsContent value="brand" className="mt-6">
            <BrandSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

interface DealPackCardProps {
  pack: DealPack;
  viewMode: "grid" | "list";
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DealPackCard({ pack, viewMode, onView, onEdit, onDelete }: DealPackCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-20 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{pack.title || "Untitled Pack"}</h3>
              <Badge variant={pack.status === "final" ? "default" : "secondary"}>
                {pack.status}
              </Badge>
              <Badge variant="outline">{pack.pack_type?.toUpperCase()}</Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              v{pack.version} • {pack.view_count} views • {pack.download_count} downloads
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
        <FileText className="h-16 w-16 text-primary/30" />
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant={pack.status === "final" ? "default" : "secondary"}>
            {pack.status}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline">{pack.pack_type?.toUpperCase()}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1">{pack.title || "Untitled Pack"}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {pack.property_data?.address || "No property linked"}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {pack.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {pack.download_count}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            v{pack.version}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button size="sm" className="flex-1" onClick={onView}>
            View
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyPacksState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="p-12 text-center">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Create Your First Deal Pack</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Transform property data into investor-grade reports in minutes.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Professional templates
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Auto-populated data
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          Track views & downloads
        </div>
      </div>
      <Button onClick={onCreate} size="lg" className="gap-2">
        <Plus className="h-4 w-4" />
        Create Deal Pack
      </Button>
    </Card>
  );
}

interface TemplatesTabProps {
  templates: DealPackTemplate[];
  onUseTemplate: (template: DealPackTemplate) => void;
}

function TemplatesTab({ templates, onUseTemplate }: TemplatesTabProps) {
  const systemTemplates = templates.filter((t) => t.is_system_template);
  const customTemplates = templates.filter((t) => !t.is_system_template);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">System Templates</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemTemplates.map((template) => (
            <Card key={template.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{template.template_type.toUpperCase()}</Badge>
                  {template.is_default && (
                    <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {template.sections?.length || 0} sections • Used {template.usage_count} times
                  </span>
                  <Button size="sm" onClick={() => onUseTemplate(template)}>
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {customTemplates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">My Custom Templates</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTemplates.map((template) => (
              <Card key={template.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <Badge variant="outline">{template.template_type.toUpperCase()}</Badge>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => onUseTemplate(template)}>
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BrandSettingsTab() {
  const [brandProfiles, setBrandProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBrandProfiles();
  }, []);

  const loadBrandProfiles = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("brand_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBrandProfiles(data || []);
    } catch (error) {
      console.error("Error loading brand profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Brand Profiles</h3>
          <p className="text-sm text-muted-foreground">
            Manage your branding for white-labeled deal packs
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Brand Profile
        </Button>
      </div>

      {brandProfiles.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Palette className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Brand Profiles</h3>
          <p className="text-muted-foreground mb-4">
            Create a brand profile to add your logo and company details to deal packs.
          </p>
          <Button>Create Brand Profile</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {brandProfiles.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: profile.primary_color + "20" }}
                  >
                    {profile.logo_url ? (
                      <img
                        src={profile.logo_url}
                        alt={profile.company_name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold" style={{ color: profile.primary_color }}>
                        {profile.company_name?.charAt(0) || "B"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{profile.company_name}</h4>
                      {profile.is_default && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
