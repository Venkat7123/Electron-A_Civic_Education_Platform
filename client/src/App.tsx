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
import { ProgressProvider } from "./components/ProgressProvider.tsx";
import { GuidedTouchProvider } from "./components/guided-touch/GuidedTouch.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { PageTitle } from "./components/PageTitle.tsx";

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
              <Route path="/" element={<><PageTitle title="Home" /><Index /></>} />
              <Route path="/login" element={<><PageTitle title="Login" /><Login /></>} />
              <Route path="/signup" element={<><PageTitle title="Signup" /><Signup /></>} />
              <Route path="/dashboard" element={<ProtectedRoute><PageTitle title="Modules" /><Dashboard /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><PageTitle title="Roadmap" /><Roadmap /></ProtectedRoute>} />
              <Route path="/module/1" element={<ProtectedRoute><PageTitle title="Module 1" /><Module1 /></ProtectedRoute>} />
              <Route path="/module/2" element={<ProtectedRoute><PageTitle title="Module 2" /><Module2 /></ProtectedRoute>} />
              <Route path="/module/3" element={<ProtectedRoute><PageTitle title="Module 3" /><Module3 /></ProtectedRoute>} />
              <Route path="/module/4" element={<ProtectedRoute><PageTitle title="Module 4" /><Module4 /></ProtectedRoute>} />
              <Route path="/module/:id" element={<ProtectedRoute><PageTitle title="Locked" /><ModuleLocked /></ProtectedRoute>} />
              <Route path="/certificate" element={<ProtectedRoute><PageTitle title="Certificate" /><Certificate /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<><PageTitle title="Not Found" /><NotFound /></>} />
            </Routes>
          </GuidedTouchProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ProgressProvider>
  </QueryClientProvider>
);

export default App;
