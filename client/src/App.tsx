import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Roadmap from "./pages/Roadmap.tsx";
import Module1 from "./pages/Module1.tsx";
import Module2 from "./pages/Module2.tsx";
import Module3 from "./pages/Module3.tsx";
import Module4 from "./pages/Module4.tsx";
import ModuleLocked from "./pages/ModuleLocked.tsx";
import Certificate from "./pages/Certificate.tsx";
import { ProgressProvider } from "./hooks/useProgress.tsx";
import { GuidedTouchProvider } from "./components/guided-touch/GuidedTouch.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProgressProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GuidedTouchProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/module/1" element={<Module1 />} />
              <Route path="/module/2" element={<Module2 />} />
              <Route path="/module/3" element={<Module3 />} />
              <Route path="/module/4" element={<Module4 />} />
              <Route path="/module/:id" element={<ModuleLocked />} />
              <Route path="/certificate" element={<Certificate />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GuidedTouchProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ProgressProvider>
  </QueryClientProvider>
);

export default App;
