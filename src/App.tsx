
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Components
import AuthForm from "./components/auth/AuthForm";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import UserProfile from "./components/dashboard/UserProfile";
import SubscriptionPlans from "./components/plans/SubscriptionPlans";
import ShiftDashboard from "./components/dashboard/ShiftDashboard";
import SpendingDashboard from "./components/dashboard/SpendingDashboard";
import ServiceProviderDashboard from "./components/dashboard/ServiceProviderDashboard";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<AuthForm mode="login" />} />
                  <Route path="/signup" element={<AuthForm mode="signup" />} />
                  <Route path="/plans" element={<SubscriptionPlans />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<div className="p-4">Dashboard Content</div>} />
                    <Route path="settings" element={<div className="p-4">Settings Content</div>} />
                    <Route path="shift" element={<ShiftDashboard />} />
                    <Route path="spending" element={<SpendingDashboard />} />
                    <Route path="service-provider" element={<ServiceProviderDashboard />} />
                  </Route>
                  
                  <Route path="/profile" element={<DashboardLayout />}>
                    <Route index element={<UserProfile />} />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
