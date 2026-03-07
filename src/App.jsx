import React from "react"; 
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import PremiumSuccess from "./pages/PremiumSuccess";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import Exercises from "./pages/Exercises";
import WorkoutLog from "./pages/WorkoutLog";
import Program from "./pages/Program";
import ChatCoach from "./pages/ChatCoach";
import NotFound from "./pages/NotFound";
import ProgressAnalytics from "./pages/ProgressAnalytics";

const queryClient = new QueryClient();

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/premium-success" element={<PremiumSuccess />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/workout-log" element={<WorkoutLog />} />
                <Route path="/program" element={<Program />} />
                <Route path="/chat-coach" element={<ChatCoach />} />
                <Route path="/progress-analytics" element={<ProgressAnalytics />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;