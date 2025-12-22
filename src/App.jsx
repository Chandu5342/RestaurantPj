import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import Scanner from "./pages/Scanner";
import NotFound from "./pages/NotFound";

import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";

import FirstPage from "./components/menu/FirstPage";
import CheckoutPage from "./components/menu/CheckoutPage";
import Order from "./components/menu/Order";

const queryClient = new QueryClient();

// Protected Route Component for Super Admin
const ProtectedSuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const session = JSON.parse(localStorage.getItem('rb_session') || '{}');

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  // Check if user is superadmin
  if (session.role !== 'superadmin' && session.role !== 'super-admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

// Protected Route Component for Restaurant Admin
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Login/Signup */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/signup" element={<Signup />} />

            {/* Dashboards / Pages */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/firstpage" element={<FirstPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <Admin />
                </ProtectedAdminRoute>
              }
            />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order" element={<Order />} />

            {/* Protected Super Admin Route */}
            <Route
              path="/super-admin"
              element={
                <ProtectedSuperAdminRoute>
                  <SuperAdmin />
                </ProtectedSuperAdminRoute>
              }
            />

            <Route path="/scan" element={<Scanner />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;