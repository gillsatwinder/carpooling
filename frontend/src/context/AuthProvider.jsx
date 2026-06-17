import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [onboardingDone, setOnboardingDone] = useState(() =>
    localStorage.getItem("onboarding") === "true"
  );

  const isAuthenticated = !!token;

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("onboarding");
    setToken(null);
    setOnboardingDone(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem("onboarding", "true");
    setOnboardingDone(true);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        onboardingDone,
        login,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}