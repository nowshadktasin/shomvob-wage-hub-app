import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { EarningsProvider } from "@/contexts/EarningsContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/layout/AppLayout";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Import critical pages directly
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Lazy load other pages for better performance
const EWA = lazy(() => import("./pages/EWA"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Help = lazy(() => import("./pages/Help"));
const History = lazy(() => import("./pages/History"));

// Import i18n
import "./i18n";

// Protected route component
// Auth redirect component for root route
const AuthRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/app/ewa" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationProvider>
          <EarningsProvider>
            <TransactionProvider>
              <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Root route - redirect based on auth state */}
                <Route path="/" element={<AuthRedirect />} />
                
                {/* Protected routes with AppLayout */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  {/* Default redirect to EWA page */}
                  <Route index element={<Navigate to="/app/ewa" replace />} />
                  <Route path="ewa" element={
                    <ErrorBoundary>
                      <Suspense fallback={<SkeletonLoader type="earnings" />}>
                        <EWA />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="history" element={
                    <ErrorBoundary>
                      <Suspense fallback={<SkeletonLoader type="transaction" count={3} />}>
                        <History />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="help" element={
                    <ErrorBoundary>
                      <Suspense fallback={<SkeletonLoader type="settings" />}>
                        <Help />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="profile" element={
                    <ErrorBoundary>
                      <Suspense fallback={<SkeletonLoader type="profile" />}>
                        <Profile />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  <Route path="settings" element={
                    <ErrorBoundary>
                      <Suspense fallback={<SkeletonLoader type="settings" />}>
                        <Settings />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                  {/* Redirect old routes */}
                  <Route path="dashboard" element={<Navigate to="ewa" replace />} />
                  <Route path="earnings" element={<Navigate to="ewa" replace />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
            </TransactionProvider>
          </EarningsProvider>
        </NavigationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
