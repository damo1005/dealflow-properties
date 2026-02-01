import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Home, 
  Calendar, 
  DollarSign, 
  Settings,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSTRStore } from "@/stores/strStore";
import { STRPropertyCard } from "@/components/str/STRPropertyCard";
import { AddPropertyWizard } from "@/components/str/AddPropertyWizard";
import { STRCalendar } from "@/components/str/STRCalendar";
import { STRFinancials } from "@/components/str/STRFinancials";
import { ListingGenerator } from "@/components/str/ListingGenerator";
import type { STRProperty, STRBooking, STRExpense, CalendarBlock } from "@/types/str";

export default function STRManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  const {
    properties,
    selectedProperty,
    bookings,
    expenses,
    isLoadingProperties,
    activeTab,
    setProperties,
    setSelectedProperty,
    setBookings,
    setExpenses,
    setIsLoadingProperties,
    setActiveTab,
  } = useSTRStore();

  const [showWizard, setShowWizard] = useState(false);
  const [calendarBlocks, setCalendarBlocks] = useState<CalendarBlock[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch properties on mount
  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  // Select property if id is in URL
  useEffect(() => {
    if (id && properties.length > 0) {
      const property = properties.find((p) => p.id === id);
      if (property) {
        setSelectedProperty(property);
        fetchPropertyData(property.id);
      }
    }
  }, [id, properties]);

  const fetchProperties = async () => {
    if (!user) return;
    
    setIsLoadingProperties(true);
    try {
      const { data, error } = await supabase
        .from("str_properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data as STRProperty[]);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const fetchPropertyData = async (propertyId: string) => {
    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("str_bookings")
        .select("*")
        .eq("str_property_id", propertyId)
        .order("checkin_date", { ascending: true });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData as STRBooking[]);

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from("str_expenses")
        .select("*")
        .eq("str_property_id", propertyId)
        .order("expense_date", { ascending: false });

      if (expensesError) throw expensesError;
      setExpenses(expensesData as STRExpense[]);

      // Fetch calendar blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from("str_calendar_blocks")
        .select("*")
        .eq("str_property_id", propertyId);

      if (blocksError) throw blocksError;
      setCalendarBlocks(blocksData as CalendarBlock[]);
    } catch (error) {
      console.error("Error fetching property data:", error);
      toast.error("Failed to load property data");
    }
  };

  const handleCreateProperty = async (data: any) => {
    if (!user) return;

    try {
      const { data: newProperty, error } = await supabase
        .from("str_properties")
        .insert({
          ...data,
          user_id: user.id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setProperties([newProperty as STRProperty, ...properties]);
      setShowWizard(false);
      toast.success("Property created successfully!");
      
      // Navigate to the new property
      navigate(`/str/${newProperty.id}`);
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property");
    }
  };

  const handleUpdateProperty = async (data: Partial<STRProperty>) => {
    if (!selectedProperty) return;

    try {
      const { error } = await supabase
        .from("str_properties")
        .update(data)
        .eq("id", selectedProperty.id);

      if (error) throw error;

      const updatedProperty = { ...selectedProperty, ...data };
      setSelectedProperty(updatedProperty);
      setProperties(
        properties.map((p) => (p.id === selectedProperty.id ? updatedProperty : p))
      );
      toast.success("Property updated!");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    }
  };

  const handleSyncICal = async () => {
    if (!selectedProperty?.airbnb_ical_url) {
      toast.error("No iCal URL configured");
      return;
    }

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-ical", {
        body: {
          property_id: selectedProperty.id,
          ical_url: selectedProperty.airbnb_ical_url,
        },
      });

      if (error) throw error;

      toast.success(`Synced ${data.synced} bookings`);
      fetchPropertyData(selectedProperty.id);
    } catch (error) {
      console.error("Error syncing iCal:", error);
      toast.error("Failed to sync calendar");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBlockDates = async (block: Omit<CalendarBlock, "id" | "created_at">) => {
    if (!selectedProperty) return;

    try {
      const { data, error } = await supabase
        .from("str_calendar_blocks")
        .insert({
          ...block,
          str_property_id: selectedProperty.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCalendarBlocks([...calendarBlocks, data as CalendarBlock]);
      toast.success("Dates blocked");
    } catch (error) {
      console.error("Error blocking dates:", error);
      toast.error("Failed to block dates");
    }
  };

  const handleAddExpense = async (expense: Omit<STRExpense, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("str_expenses")
        .insert(expense)
        .select()
        .single();

      if (error) throw error;

      setExpenses([data as STRExpense, ...expenses]);
      toast.success("Expense added");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  // Show wizard
  if (showWizard) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <AddPropertyWizard
            onComplete={handleCreateProperty}
            onCancel={() => setShowWizard(false)}
          />
        </div>
      </AppLayout>
    );
  }

  // Show property detail view
  if (selectedProperty) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedProperty(null);
                  navigate("/str");
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{selectedProperty.property_name}</h1>
                <p className="text-muted-foreground">
                  {selectedProperty.address || selectedProperty.postcode}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <Home className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="financials" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Financials
              </TabsTrigger>
              <TabsTrigger value="optimize" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Optimize
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <STRPropertyCard
                  property={selectedProperty}
                  onView={() => {}}
                  onOptimize={() => setActiveTab("optimize")}
                />
                
                {/* Quick Stats */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Bookings</p>
                      <p className="text-2xl font-bold">{bookings.length}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Expenses</p>
                      <p className="text-2xl font-bold">{expenses.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <STRCalendar
                bookings={bookings}
                blocks={calendarBlocks}
                onSync={handleSyncICal}
                onBlockDates={handleBlockDates}
                isSyncing={isSyncing}
                lastSyncedAt={bookings[0]?.last_synced_at}
              />
            </TabsContent>

            <TabsContent value="financials">
              <STRFinancials
                bookings={bookings}
                expenses={expenses}
                onAddExpense={handleAddExpense}
                propertyId={selectedProperty.id}
                userId={user?.id || ""}
              />
            </TabsContent>

            <TabsContent value="optimize">
              <ListingGenerator
                property={selectedProperty}
                onSave={handleUpdateProperty}
              />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    );
  }

  // Show properties list
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Short-Term Rental Management</h1>
            <p className="text-muted-foreground">
              Manage your Airbnb, VRBO, and vacation rental properties
            </p>
          </div>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Properties Grid */}
        {isLoadingProperties ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border rounded-lg border-dashed">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Add Your First Rental Property</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Start managing your Airbnb or vacation rental with AI-powered 
              listing optimization, calendar sync, and financial tracking.
            </p>
            <Button onClick={() => setShowWizard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <STRPropertyCard
                key={property.id}
                property={property}
                onView={(id) => navigate(`/str/${id}`)}
                onOptimize={(id) => {
                  navigate(`/str/${id}`);
                  setActiveTab("optimize");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
