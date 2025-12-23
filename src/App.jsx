import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order" element={<Order />} />

            <Route path="/super-admin" element={<SuperAdmin />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
