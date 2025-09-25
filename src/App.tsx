import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Dashboard from "./pages/Dashboard";
import TasksList from "./pages/TasksList";
import TaskCreate from "./pages/TaskCreate";
import TaskEdit from "./pages/TaskEdit";
import Calendar from "./pages/Calendar";
import Account from "./pages/Account";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PremiumComparison from "./pages/PremiumComparison";
import NotificationSettings from "./pages/NotificationSettings";
import HelpFAQ from "./pages/HelpFAQ";
import ChangePassword from "./pages/ChangePassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/task/create" element={<TaskCreate />} />
            <Route path="/task/edit/:id" element={<TaskEdit />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/account" element={<Account />} />
            <Route path="/premium" element={<PremiumComparison />} />
            <Route path="/notifications" element={<NotificationSettings />} />
            <Route path="/help" element={<HelpFAQ />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
