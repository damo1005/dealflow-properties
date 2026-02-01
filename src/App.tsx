import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Onboarding from "./pages/Onboarding";

// Protected pages
import Dashboard from "./pages/Dashboard";
import SearchProperties from "./pages/SearchProperties";
import PropertyDetail from "./pages/PropertyDetail";
import Pipeline from "./pages/Pipeline";
import SavedSearches from "./pages/SavedSearches";
import Calculators from "./pages/Calculators";
import Settings from "./pages/Settings";
import DealPackGenerator from "./pages/DealPackGenerator";
import DealPacks from "./pages/DealPacks";
import ViewingNotesRecording from "./pages/ViewingNotesRecording";
import ViewingNotesResults from "./pages/ViewingNotesResults";
import Compare from "./pages/Compare";
import MyComparisons from "./pages/MyComparisons";
import ScenarioBuilder from "./pages/ScenarioBuilder";
import AccommodationRequests from "./pages/AccommodationRequests";
import DealScout from "./pages/DealScout";
import Alerts from "./pages/Alerts";
import Portfolio from "./pages/Portfolio";
import PortfolioDashboard from "./pages/PortfolioDashboard";
import Auctions from "./pages/Auctions";
import Network from "./pages/Network";
import Copilot from "./pages/Copilot";
import Mortgages from "./pages/Mortgages";
import Integrations from "./pages/Integrations";
import MarketIntel from "./pages/MarketIntel";
import STRManagement from "./pages/STRManagement";
import Conveyancing from "./pages/Conveyancing";
import Contractors from "./pages/Contractors";
import NotFound from "./pages/NotFound";

// Admin pages
import {
  AdminDashboard,
  AdminUsers,
  AdminSupport,
  AdminSettings,
  AdminRevenue,
  AdminAffiliates,
} from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id"
              element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/record"
              element={
                <ProtectedRoute>
                  <ViewingNotesRecording />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/viewing-notes"
              element={
                <ProtectedRoute>
                  <ViewingNotesRecording />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/viewing-notes/:noteId"
              element={
                <ProtectedRoute>
                  <ViewingNotesResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <Compare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comparisons"
              element={
                <ProtectedRoute>
                  <MyComparisons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scenarios"
              element={
                <ProtectedRoute>
                  <ScenarioBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id/scenarios"
              element={
                <ProtectedRoute>
                  <ScenarioBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pipeline"
              element={
                <ProtectedRoute>
                  <Pipeline />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-searches"
              element={
                <ProtectedRoute>
                  <SavedSearches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calculators"
              element={
                <ProtectedRoute>
                  <Calculators />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calculators/:id"
              element={
                <ProtectedRoute>
                  <Calculators />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deal-pack"
              element={
                <ProtectedRoute>
                  <DealPackGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deal-pack/new"
              element={
                <ProtectedRoute>
                  <DealPackGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deal-pack/:propertyId"
              element={
                <ProtectedRoute>
                  <DealPackGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deal-packs"
              element={
                <ProtectedRoute>
                  <DealPacks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accommodation"
              element={
                <ProtectedRoute>
                  <AccommodationRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deal-scout"
              element={
                <ProtectedRoute>
                  <DealScout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/dashboard"
              element={
                <ProtectedRoute>
                  <PortfolioDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auctions"
              element={
                <ProtectedRoute>
                  <Auctions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/network"
              element={
                <ProtectedRoute>
                  <Network />
                </ProtectedRoute>
              }
            />
            <Route
              path="/copilot"
              element={
                <ProtectedRoute>
                  <Copilot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mortgages"
              element={
                <ProtectedRoute>
                  <Mortgages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/integrations"
              element={
                <ProtectedRoute>
                  <Integrations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/market-intel"
              element={
                <ProtectedRoute>
                  <MarketIntel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/str"
              element={
                <ProtectedRoute>
                  <STRManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/str/:id"
              element={
                <ProtectedRoute>
                  <STRManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conveyancing"
              element={
                <ProtectedRoute>
                  <Conveyancing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contractors"
              element={
                <ProtectedRoute>
                  <Contractors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/revenue" element={<AdminRevenue />} />
            <Route path="/admin/affiliates" element={<AdminAffiliates />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
