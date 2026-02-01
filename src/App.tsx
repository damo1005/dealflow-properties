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
import PropertyPerformance from "./pages/PropertyPerformance";
import Auctions from "./pages/Auctions";
import Network from "./pages/Network";
import Copilot from "./pages/Copilot";
import Mortgages from "./pages/Mortgages";
import Integrations from "./pages/Integrations";
import MarketIntel from "./pages/MarketIntel";
import STRManagement from "./pages/STRManagement";
import Conveyancing from "./pages/Conveyancing";
import Contractors from "./pages/Contractors";
import Reports from "./pages/Reports";
import DealAnalyser from "./pages/DealAnalyser";
import TeamSettings from "./pages/TeamSettings";
import JVDeals from "./pages/JVDeals";
import AccountantPortal from "./pages/AccountantPortal";
import PortfolioSharing from "./pages/PortfolioSharing";
import MortgageTracker from "./pages/MortgageTracker";
import YieldMap from "./pages/YieldMap";
import ApiSettings from "./pages/ApiSettings";
import Insurance from "./pages/Insurance";
import PropertyValuation from "./pages/PropertyValuation";
import TenantApplications from "./pages/TenantApplications";
import RentCollection from "./pages/RentCollection";
import PortfolioBenchmark from "./pages/PortfolioBenchmark";
import AgentClients from "./pages/AgentClients";
import AgentSettings from "./pages/AgentSettings";
import MTDCompliance from "./pages/MTDCompliance";
import DepositProtection from "./pages/DepositProtection";
import ESignatures from "./pages/ESignatures";
import InsuranceClaims from "./pages/InsuranceClaims";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Rewards from "./pages/Rewards";
import BankTransactions from "./pages/BankTransactions";
import MileageTracker from "./pages/MileageTracker";
import RegionalCalculators from "./pages/RegionalCalculators";
import RentGuarantee from "./pages/RentGuarantee";
import Utilities from "./pages/Utilities";
import DevelopmentAppraisal from "./pages/DevelopmentAppraisal";
import BridgingCalculator from "./pages/BridgingCalculator";
import VirtualTours from "./pages/VirtualTours";
import Accreditations from "./pages/Accreditations";
import Companies from "./pages/Companies";
import RentalListings from "./pages/RentalListings";
import SmartHome from "./pages/SmartHome";
import CarbonFootprint from "./pages/CarbonFootprint";
import ConstructionRadar from "./pages/ConstructionRadar";
import ContractorDemand from "./pages/ContractorDemandPage";
import { AIChatWidget } from "./components/copilot/AIChatWidget";
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
              path="/properties/:id/performance"
              element={
                <ProtectedRoute>
                  <PropertyPerformance />
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
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/deal-analyser"
              element={
                <ProtectedRoute>
                  <DealAnalyser />
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
            <Route
              path="/settings/team"
              element={
                <ProtectedRoute>
                  <TeamSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/sharing"
              element={
                <ProtectedRoute>
                  <PortfolioSharing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/api"
              element={
                <ProtectedRoute>
                  <ApiSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/jv-deals"
              element={
                <ProtectedRoute>
                  <JVDeals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/mortgages"
              element={
                <ProtectedRoute>
                  <MortgageTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tools/yield-map"
              element={
                <ProtectedRoute>
                  <YieldMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant"
              element={
                <ProtectedRoute>
                  <AccountantPortal />
                </ProtectedRoute>
              }
            />

            {/* Phase 9 & 12 routes */}
            <Route path="/tools/valuation" element={<ProtectedRoute><PropertyValuation /></ProtectedRoute>} />
            <Route path="/tenants/applications" element={<ProtectedRoute><TenantApplications /></ProtectedRoute>} />
            <Route path="/portfolio/rent-collection" element={<ProtectedRoute><RentCollection /></ProtectedRoute>} />
            <Route path="/analytics/benchmark" element={<ProtectedRoute><PortfolioBenchmark /></ProtectedRoute>} />
            <Route path="/agent/clients" element={<ProtectedRoute><AgentClients /></ProtectedRoute>} />
            <Route path="/agent/settings" element={<ProtectedRoute><AgentSettings /></ProtectedRoute>} />
            <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
            <Route path="/tax/mtd" element={<ProtectedRoute><MTDCompliance /></ProtectedRoute>} />
            <Route path="/compliance/deposits" element={<ProtectedRoute><DepositProtection /></ProtectedRoute>} />
            <Route path="/documents/signatures" element={<ProtectedRoute><ESignatures /></ProtectedRoute>} />
            <Route path="/insurance/claims" element={<ProtectedRoute><InsuranceClaims /></ProtectedRoute>} />
            <Route path="/community/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
            <Route path="/portfolio/bank-transactions" element={<ProtectedRoute><BankTransactions /></ProtectedRoute>} />
            <Route path="/tools/mileage" element={<ProtectedRoute><MileageTracker /></ProtectedRoute>} />
            <Route path="/calculators/regional" element={<ProtectedRoute><RegionalCalculators /></ProtectedRoute>} />
            <Route path="/calculators/bridging" element={<ProtectedRoute><BridgingCalculator /></ProtectedRoute>} />
            
            {/* Phase 13 routes */}
            <Route path="/insurance/rent-guarantee" element={<ProtectedRoute><RentGuarantee /></ProtectedRoute>} />
            <Route path="/portfolio/utilities" element={<ProtectedRoute><Utilities /></ProtectedRoute>} />
            <Route path="/tools/development-appraisal" element={<ProtectedRoute><DevelopmentAppraisal /></ProtectedRoute>} />
            <Route path="/portfolio/virtual-tours" element={<ProtectedRoute><VirtualTours /></ProtectedRoute>} />
            
            {/* Phase 14 routes */}
            <Route path="/compliance/accreditations" element={<ProtectedRoute><Accreditations /></ProtectedRoute>} />
            <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
            <Route path="/lettings/listings" element={<ProtectedRoute><RentalListings /></ProtectedRoute>} />
            <Route path="/portfolio/smart-home" element={<ProtectedRoute><SmartHome /></ProtectedRoute>} />
            <Route path="/tools/carbon" element={<ProtectedRoute><CarbonFootprint /></ProtectedRoute>} />
            <Route path="/construction-radar" element={<ProtectedRoute><ConstructionRadar /></ProtectedRoute>} />
            <Route path="/contractor-demand" element={<ProtectedRoute><ContractorDemand /></ProtectedRoute>} />

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
          <AIChatWidget />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
