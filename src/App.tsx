import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventEdit from "./pages/EventEdit";
import Catalogs from "./pages/Catalogs";
import Users from "./pages/Users";
import Calendar from "./pages/Calendar";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./components/ForgotPassword";
import RecoverPassword from "./components/RecoverPassword";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Index />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/recover-password/:recover_token" element={<RecoverPassword />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/home" element={<Navigate to="/events" replace />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/edit" element={<EventEdit />} />
              <Route path="/catalogs" element={<Catalogs />} />
              <Route path="/users" element={<Users />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
