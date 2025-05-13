
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LeadProvider } from "./context/LeadContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Lead Pages
import InitialLeadForm from "./pages/leads/InitialLeadForm";
import DetailedLeadForm from "./pages/leads/DetailedLeadForm";
import LeadList from "./pages/leads/LeadList";

// Field Pages
import FieldsHome from "./pages/fields/FieldsHome";
import FactoryUX from "./pages/fields/FactoryUX";
import FactoryOS from "./pages/fields/FactoryOS";
import MachineSafety from "./pages/fields/MachineSafety";
import UXForm from "./pages/fields/UXForm";
import OSForm from "./pages/fields/OSForm";

const queryClient = new QueryClient();

// Protected Route component for authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/leads" replace />} />
      
      {/* Lead Routes */}
      <Route path="/lead-form" element={<ProtectedRoute><InitialLeadForm /></ProtectedRoute>} />
      <Route path="/lead-form-detailed" element={<ProtectedRoute><DetailedLeadForm /></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><LeadList /></ProtectedRoute>} />
      
      {/* Field Routes */}
      <Route path="/fields/:leadId" element={<ProtectedRoute><FieldsHome /></ProtectedRoute>} />
      <Route path="/fields/:leadId/factory-ux" element={<ProtectedRoute><FactoryUX /></ProtectedRoute>} />
      <Route path="/fields/:leadId/factory-os" element={<ProtectedRoute><FactoryOS /></ProtectedRoute>} />
      <Route path="/fields/:leadId/machine-safety" element={<ProtectedRoute><MachineSafety /></ProtectedRoute>} />
      
      {/* Dynamic Forms */}
      <Route path="/fields/:leadId/factory-ux/:formType" element={<ProtectedRoute><UXForm /></ProtectedRoute>} />
      <Route path="/fields/:leadId/factory-os/:formType" element={<ProtectedRoute><OSForm /></ProtectedRoute>} />
      
      {/* 404 Route - catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LeadProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LeadProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
