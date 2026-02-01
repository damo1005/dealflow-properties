import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, FileText, GraduationCap, AlertTriangle, Plus, ExternalLink, Search, Calendar, Check, X } from "lucide-react";
import { ACCREDITATION_SCHEMES, LICENSE_TYPES } from "@/types/accreditation";

// Mock data
const mockAccreditations = [
  {
    id: "1",
    scheme_name: "nrla",
    provider: "NRLA",
    membership_number: "NRL-123456",
    accreditation_level: "Accredited",
    start_date: "2024-03-01",
    expiry_date: "2026-03-01",
    cpd_hours_required: 12,
    cpd_hours_completed: 8,
    annual_fee: 95,
    status: "active",
  },
  {
    id: "2",
    scheme_name: "rent_smart_wales",
    provider: "Rent Smart Wales",
    membership_number: "RSW-78901",
    accreditation_level: "Registered",
    start_date: "2023-11-15",
    expiry_date: "2026-11-15",
    cpd_hours_required: 0,
    cpd_hours_completed: 0,
    annual_fee: 0,
    status: "active",
  },
];

const mockLicenses = [
  {
    id: "1",
    license_type: "hmo_mandatory",
    local_authority: "Manchester City Council",
    license_number: "HMO/2024/1234",
    expiry_date: "2027-08-15",
    max_occupants: 6,
    status: "active",
    property_address: "14 Oak Street",
  },
  {
    id: "2",
    license_type: "selective",
    local_authority: "Salford City Council",
    application_date: "2026-01-15",
    status: "pending",
    property_address: "28 Victoria Road",
  },
];

const mockCPD = [
  { id: "1", activity_name: "Fire Safety Update", provider: "NRLA", activity_date: "2026-01-15", hours: 2 },
  { id: "2", activity_name: "EPC Regulations Webinar", provider: "Landlord Zone", activity_date: "2025-12-10", hours: 1.5 },
  { id: "3", activity_name: "Tenant Referencing", provider: "OpenRent", activity_date: "2025-11-01", hours: 1 },
];

export default function Accreditations() {
  const [showAddAccreditation, setShowAddAccreditation] = useState(false);
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [showAddCPD, setShowAddCPD] = useState(false);
  const [licenseCheckPostcode, setLicenseCheckPostcode] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Pending</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLicenseTypeLabel = (type: string) => {
    return LICENSE_TYPES.find(t => t.value === type)?.label || type;
  };

  const daysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accreditations & Licenses</h1>
            <p className="text-muted-foreground">Manage your landlord memberships and property licenses</p>
          </div>
        </div>

        {/* Alerts */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">🟡 NRLA Membership expires in 28 days</span>
              <Button size="sm" variant="outline">Renew Now</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">🟡 HMO License (14 Oak St) expires in 45 days</span>
              <Button size="sm" variant="outline">Start Renewal</Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">🔴 CPD: 4 hours needed before Mar 2026</span>
              <Button size="sm" variant="outline">Find Courses</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="accreditations">
          <TabsList>
            <TabsTrigger value="accreditations" className="gap-2">
              <Award className="h-4 w-4" />
              Accreditations
            </TabsTrigger>
            <TabsTrigger value="licenses" className="gap-2">
              <FileText className="h-4 w-4" />
              Property Licenses
            </TabsTrigger>
            <TabsTrigger value="cpd" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              CPD Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accreditations" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Dialog open={showAddAccreditation} onOpenChange={setShowAddAccreditation}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" />Add Accreditation</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Accreditation</DialogTitle>
                    <DialogDescription>Add a new landlord accreditation or membership</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Scheme</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select scheme" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCREDITATION_SCHEMES.map(scheme => (
                            <SelectItem key={scheme.value} value={scheme.value}>{scheme.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Membership Number</Label>
                      <Input placeholder="e.g., NRL-123456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Annual Fee (£)</Label>
                      <Input type="number" placeholder="95" />
                    </div>
                    <Button className="w-full">Add Accreditation</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockAccreditations.map(acc => (
                <Card key={acc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{acc.provider}</h3>
                          {getStatusBadge(acc.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Member #: {acc.membership_number} | Level: {acc.accreditation_level}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(acc.expiry_date).toLocaleDateString()} ({daysUntilExpiry(acc.expiry_date)} days)
                        </p>
                        {acc.annual_fee > 0 && (
                          <p className="text-sm text-muted-foreground">Annual Fee: £{acc.annual_fee}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Certificate</Button>
                        <Button variant="outline" size="sm">Renew</Button>
                      </div>
                    </div>
                    {acc.cpd_hours_required > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">CPD Progress: {acc.cpd_hours_completed}/{acc.cpd_hours_required} hours</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((acc.cpd_hours_completed / acc.cpd_hours_required) * 100)}%
                          </span>
                        </div>
                        <Progress value={(acc.cpd_hours_completed / acc.cpd_hours_required) * 100} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-4 mt-6">
            {/* License Checker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Do I Need a License?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input 
                    placeholder="Enter postcode" 
                    value={licenseCheckPostcode}
                    onChange={(e) => setLicenseCheckPostcode(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button>Check</Button>
                </div>
                {licenseCheckPostcode && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Results for {licenseCheckPostcode.toUpperCase()}:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Mandatory HMO: Required if 5+ tenants, 3+ storeys</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>Additional HMO: Required for 3-4 tenants sharing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-muted-foreground" />
                        <span>Selective Licensing: Not in selective area</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Dialog open={showAddLicense} onOpenChange={setShowAddLicense}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" />Add License</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Property License</DialogTitle>
                    <DialogDescription>Add a property license record</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>License Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {LICENSE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Local Authority</Label>
                      <Input placeholder="e.g., Manchester City Council" />
                    </div>
                    <div className="space-y-2">
                      <Label>License Number</Label>
                      <Input placeholder="e.g., HMO/2024/1234" />
                    </div>
                    <Button className="w-full">Add License</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockLicenses.map(license => (
                <Card key={license.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{license.property_address} - {getLicenseTypeLabel(license.license_type)}</h3>
                          {getStatusBadge(license.status)}
                        </div>
                        {license.license_number && (
                          <p className="text-sm text-muted-foreground">License #: {license.license_number}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Authority: {license.local_authority}</p>
                        {license.expiry_date && (
                          <p className="text-sm text-muted-foreground">
                            Expires: {new Date(license.expiry_date).toLocaleDateString()}
                          </p>
                        )}
                        {license.max_occupants && (
                          <p className="text-sm text-muted-foreground">Max Occupants: {license.max_occupants}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View License</Button>
                        {license.status === "pending" && (
                          <Button variant="outline" size="sm">Check Status</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cpd" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Dialog open={showAddCPD} onOpenChange={setShowAddCPD}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" />Log CPD Activity</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log CPD Activity</DialogTitle>
                    <DialogDescription>Record a completed CPD activity</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Activity Name</Label>
                      <Input placeholder="e.g., Fire Safety Update" />
                    </div>
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Input placeholder="e.g., NRLA" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Hours</Label>
                        <Input type="number" step="0.5" placeholder="2" />
                      </div>
                    </div>
                    <Button className="w-full">Log Activity</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>CPD Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCPD.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{activity.activity_name}</p>
                        <p className="text-sm text-muted-foreground">{activity.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.hours} hours</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.activity_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Find CPD Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="justify-start h-auto py-4">
                    <div className="text-left">
                      <p className="font-medium">NRLA Training</p>
                      <p className="text-sm text-muted-foreground">Free webinars for members</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4">
                    <div className="text-left">
                      <p className="font-medium">Property Investment Project</p>
                      <p className="text-sm text-muted-foreground">Landlord education courses</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
