import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Upload,
  FolderPlus,
  Grid3X3,
  List,
  Search,
  Star,
  Share2,
  Clock,
  File,
  Image,
  FileSpreadsheet,
  Building2,
  Shield,
  Receipt,
  Camera,
  Briefcase,
  Plus,
  MoreVertical,
  Download,
  Link,
  Trash2,
  FolderOpen,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentUploadDialog } from "@/components/documents/DocumentUploadDialog";
import { DocumentViewerDialog } from "@/components/documents/DocumentViewerDialog";
import { CreateFolderDialog } from "@/components/documents/CreateFolderDialog";
import { format } from "date-fns";

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  category: string;
  title?: string;
  tags: string[];
  is_favorite: boolean;
  uploaded_at: string;
  property_address?: string;
}

interface Folder {
  id: string;
  folder_name: string;
  color: string;
  icon: string;
  document_count: number;
}

const CATEGORIES = [
  { key: "tenancy_agreements", label: "Tenancy Agreements", icon: FileText, color: "text-blue-500" },
  { key: "certificates", label: "Certificates", icon: Shield, color: "text-green-500" },
  { key: "invoices", label: "Invoices", icon: Receipt, color: "text-orange-500" },
  { key: "photos", label: "Photos", icon: Camera, color: "text-purple-500" },
  { key: "insurance", label: "Insurance", icon: Briefcase, color: "text-cyan-500" },
  { key: "mortgages", label: "Mortgages", icon: Building2, color: "text-indigo-500" },
  { key: "other", label: "Other", icon: File, color: "text-gray-500" },
];

// Mock data
const mockDocuments: Document[] = [
  {
    id: "1",
    file_name: "AST_Tenancy_2026.pdf",
    file_type: "pdf",
    file_size: 2400000,
    file_url: "#",
    category: "tenancy_agreements",
    title: "Tenancy Agreement - John Smith",
    tags: ["tenancy", "2026", "ast"],
    is_favorite: true,
    uploaded_at: "2026-02-01T10:00:00Z",
    property_address: "123 High Street, EN3",
  },
  {
    id: "2",
    file_name: "Gas_Safety_Mar26.pdf",
    file_type: "pdf",
    file_size: 1100000,
    file_url: "#",
    category: "certificates",
    title: "Gas Safety Certificate",
    tags: ["gas", "safety", "2026"],
    is_favorite: false,
    uploaded_at: "2026-01-28T14:30:00Z",
    property_address: "123 High Street, EN3",
  },
  {
    id: "3",
    file_name: "Kitchen_Photo.jpg",
    file_type: "jpg",
    file_size: 4500000,
    file_url: "#",
    category: "photos",
    title: "Kitchen Renovation",
    tags: ["kitchen", "renovation"],
    is_favorite: false,
    uploaded_at: "2026-01-25T09:15:00Z",
    property_address: "45 Oak Road, N17",
  },
  {
    id: "4",
    file_name: "Invoice_1234.pdf",
    file_type: "pdf",
    file_size: 890000,
    file_url: "#",
    category: "invoices",
    title: "Boiler Repair Invoice",
    tags: ["invoice", "repair", "boiler"],
    is_favorite: false,
    uploaded_at: "2026-01-20T16:45:00Z",
    property_address: "123 High Street, EN3",
  },
];

const mockFolders: Folder[] = [
  { id: "1", folder_name: "2R Stays Documents", color: "blue", icon: "📁", document_count: 12 },
  { id: "2", folder_name: "Tax Documents 2025", color: "green", icon: "💰", document_count: 8 },
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return <FileText className="h-8 w-8 text-red-500" />;
    case "jpg":
    case "jpeg":
    case "png":
      return <Image className="h-8 w-8 text-purple-500" />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

export default function Documents() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !activeCategory || doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.key] = mockDocuments.filter((d) => d.category === cat.key).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const favoriteDocuments = mockDocuments.filter((d) => d.is_favorite);
  const recentDocuments = mockDocuments.slice(0, 5);

  return (
    <AppLayout title="Document Vault">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Sidebar */}
        <div className="w-72 flex-shrink-0 overflow-y-auto">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                My Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Access */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Access
                </p>
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm hover:bg-muted transition-colors ${
                    !activeCategory ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    All Documents
                  </span>
                  <Badge variant="secondary">{mockDocuments.length}</Badge>
                </button>
                <button className="w-full flex items-center justify-between p-2 rounded-lg text-sm hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent
                  </span>
                  <Badge variant="secondary">{recentDocuments.length}</Badge>
                </button>
                <button className="w-full flex items-center justify-between p-2 rounded-lg text-sm hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Shared
                  </span>
                  <Badge variant="secondary">3</Badge>
                </button>
                <button className="w-full flex items-center justify-between p-2 rounded-lg text-sm hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Favorites
                  </span>
                  <Badge variant="secondary">{favoriteDocuments.length}</Badge>
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-1 pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Categories
                </p>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm hover:bg-muted transition-colors ${
                        activeCategory === cat.key ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${cat.color}`} />
                        {cat.label}
                      </span>
                      <Badge variant="secondary">{categoryCounts[cat.key] || 0}</Badge>
                    </button>
                  );
                })}
              </div>

              {/* Custom Folders */}
              <div className="space-y-1 pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Custom Folders
                </p>
                {mockFolders.map((folder) => (
                  <button
                    key={folder.id}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-sm hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      <span>{folder.icon}</span>
                      {folder.folder_name}
                    </span>
                    <Badge variant="secondary">{folder.document_count}</Badge>
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setShowCreateFolder(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </div>

              {/* Storage Usage */}
              <div className="pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Storage
                </p>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[49%] bg-primary rounded-full" />
                  </div>
                  <p className="text-xs text-muted-foreground">245 MB / 500 MB (49%)</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Upgrade for more storage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" onClick={() => setShowCreateFolder(true)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
              <TabsList className="h-9">
                <TabsTrigger value="grid" className="px-2">
                  <Grid3X3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-2">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {filteredDocuments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Upload your first property document to get started
                  </p>
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </CardContent>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3 relative">
                        {getFileIcon(doc.file_type)}
                        {doc.is_favorite && (
                          <Star className="absolute top-2 right-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="font-medium text-sm truncate" title={doc.title || doc.file_name}>
                        {doc.title || doc.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{doc.file_name}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>{format(new Date(doc.uploaded_at), "MMM d")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Property</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Size</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Uploaded</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => {
                        const category = CATEGORIES.find((c) => c.key === doc.category);
                        return (
                          <tr
                            key={doc.id}
                            className="border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {getFileIcon(doc.file_type)}
                                <div>
                                  <p className="font-medium text-sm">{doc.title || doc.file_name}</p>
                                  <p className="text-xs text-muted-foreground">{doc.file_name}</p>
                                </div>
                                {doc.is_favorite && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary">{category?.label || doc.category}</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {doc.property_address || "-"}
                            </td>
                            <td className="py-3 px-4 text-right text-sm">
                              {formatFileSize(doc.file_size)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm text-muted-foreground">
                              {format(new Date(doc.uploaded_at), "MMM d, yyyy")}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Link className="h-4 w-4 mr-2" />
                                    Share Link
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    Move to Folder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Star className="h-4 w-4 mr-2" />
                                    Add to Favorites
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <DocumentUploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />
      <CreateFolderDialog open={showCreateFolder} onOpenChange={setShowCreateFolder} />
      <DocumentViewerDialog
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
        document={selectedDocument}
      />
    </AppLayout>
  );
}
