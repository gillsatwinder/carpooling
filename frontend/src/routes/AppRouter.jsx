import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "../pages/Register";
import Onboarding from "../pages/Onboarding";
import Home from "../pages/Landing/Home";
import Login from "../pages/login";
import { useAuth } from "../context/useAuth";
import Dashboard from "../pages/Dashboard";
import AppLayout from "../layouts/AppLayout";
import RideManagement from "../pages/RideManagement";
import Profile from "../pages/Profile";
import MyRequestedRides from "../pages/MyRequestedRides";

function OnboardingRoute({ children }) {
  const { isAuthenticated, onboarded } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (onboarded) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
// For dashboard route 
function ProtectedRoute({ children }) {
  const { isAuthenticated, onboarded } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}




export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        

        {/* Onboarding (only after login, before completion) */}
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />

        {/* Dashboard (fully protected) */}
       <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
              <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

         <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
              <Profile/>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-requested-rides"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyRequestedRides />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ride-management"
          element={
            <ProtectedRoute>
              <AppLayout>
                <RideManagement />
              </AppLayout>
            </ProtectedRoute>
          }
        />  

        {/* Default redirect */}
        <Route path="/" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}