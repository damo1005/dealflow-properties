import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SearchProperties from "./pages/SearchProperties";
import PropertyDetail from "./pages/PropertyDetail";
import Pipeline from "./pages/Pipeline";
import SavedSearches from "./pages/SavedSearches";
import Calculators from "./pages/Calculators";
import Settings from "./pages/Settings";
import DealPackGenerator from "./pages/DealPackGenerator";
import ViewingNotesRecording from "./pages/ViewingNotesRecording";
import ViewingNotesResults from "./pages/ViewingNotesResults";
import Compare from "./pages/Compare";
import MyComparisons from "./pages/MyComparisons";
import ScenarioBuilder from "./pages/ScenarioBuilder";
import AccommodationRequests from "./pages/AccommodationRequests";
import DealScout from "./pages/DealScout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchProperties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/property/:id/record" element={<ViewingNotesRecording />} />
          <Route path="/property/:id/viewing-notes" element={<ViewingNotesRecording />} />
          <Route path="/property/:id/viewing-notes/:noteId" element={<ViewingNotesResults />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/comparisons" element={<MyComparisons />} />
          <Route path="/scenarios" element={<ScenarioBuilder />} />
          <Route path="/property/:id/scenarios" element={<ScenarioBuilder />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/saved-searches" element={<SavedSearches />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/:id" element={<Calculators />} />
          <Route path="/deal-pack" element={<DealPackGenerator />} />
          <Route path="/deal-pack/:propertyId" element={<DealPackGenerator />} />
          <Route path="/accommodation" element={<AccommodationRequests />} />
          <Route path="/deal-scout" element={<DealScout />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
