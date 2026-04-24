import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index.tsx";
import Analysis from "./pages/Analysis.tsx";
import Ingestion from "./pages/Ingestion.tsx";
import Extract from "./pages/Extract.tsx";
import Network from "./pages/Network.tsx";
import FrameworkMap from "./pages/FrameworkMap.tsx";
import NigeriaDemandIntelligence from "./pages/NigeriaDemandIntelligence.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/network" element={<Network />} />
          <Route path="/ingestion" element={<Ingestion />} />
          <Route path="/extract" element={<Extract />} />
          <Route path="/framework" element={<FrameworkMap />} />
          <Route path="/nigeria" element={<NigeriaDemandIntelligence />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
