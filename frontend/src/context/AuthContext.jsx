import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [onboardingDone, setOnboardingDone] = useState(false);

  // -------------------------
  // INIT FROM LOCALSTORAGE
  // -------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedOnboarding = localStorage.getItem("onboarding");

    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }

    if (savedOnboarding === "true") {
      setOnboardingDone(true);
    }
  }, []);

  // -------------------------
  // LOGIN
  // -------------------------
  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setIsAuthenticated(true);
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("onboarding");

    setToken(null);
    setIsAuthenticated(false);
    setOnboardingDone(false);
  };

  // -------------------------
  // COMPLETE ONBOARDING
  // -------------------------
  const completeOnboarding = () => {
    localStorage.setItem("onboarding", "true");
    setOnboardingDone(true);
  };

  // -------------------------
  // CONTEXT VALUE
  // -------------------------
  const value = {
    token,
    isAuthenticated,
    onboardingDone,
    login,
    logout,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// -------------------------
// HOOK
// -------------------------
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}