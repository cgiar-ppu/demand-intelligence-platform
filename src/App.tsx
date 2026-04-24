import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VersionProvider } from "@/lib/VersionContext";
import { BriefProvider } from "@/lib/BriefContext";
import { Navbar } from "@/components/Navbar";
// Classic pages
import Index from "./pages/Index.tsx";
import Analysis from "./pages/Analysis.tsx";
import Ingestion from "./pages/Ingestion.tsx";
import Extract from "./pages/Extract.tsx";
import Network from "./pages/Network.tsx";
import FrameworkMap from "./pages/FrameworkMap.tsx";
import NigeriaDemandIntelligence from "./pages/NigeriaDemandIntelligence.tsx";
// v2 Journal pages
import DemandView from "./pages/v2/DemandView.tsx";
import CountryIntelligence from "./pages/v2/CountryIntelligence.tsx";
import InnovationMatch from "./pages/v2/InnovationMatch.tsx";
import StrategicFindings from "./pages/v2/StrategicFindings.tsx";
import DecisionBrief from "./pages/v2/DecisionBrief.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VersionProvider>
        <BriefProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              {/* Classic routes */}
              <Route path="/" element={<Index />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/network" element={<Network />} />
              <Route path="/ingestion" element={<Ingestion />} />
              <Route path="/extract" element={<Extract />} />
              <Route path="/framework" element={<FrameworkMap />} />
              <Route path="/nigeria" element={<NigeriaDemandIntelligence />} />
              {/* v2 Journal routes */}
              <Route path="/v2/demand" element={<DemandView />} />
              <Route path="/v2/country" element={<CountryIntelligence />} />
              <Route path="/v2/innovation" element={<InnovationMatch />} />
              <Route path="/v2/findings" element={<StrategicFindings />} />
              <Route path="/v2/brief" element={<DecisionBrief />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BriefProvider>
      </VersionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
