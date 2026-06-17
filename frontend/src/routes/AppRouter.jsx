import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "../pages/Register";
import Onboarding from "../pages/Onboarding";
import Home from "../pages/Landing/Home";

import { useAuth } from "../context/useAuth";

/*

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return children;
}
*/

function OnboardingRoute({ children }) {
  const { isAuthenticated, onboardingDone } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  if (onboardingDone) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/register" element={<Register />} />

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
       {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        */}

        {/* Default redirect */}
        <Route path="/" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}