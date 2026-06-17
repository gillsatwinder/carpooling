import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
  !!localStorage.getItem("token")
);

const [onboardingDone, setOnboardingDone] = useState(() =>
  localStorage.getItem("onboarding") === "true"
);
 

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("onboarding");

    setToken(null);
    setIsAuthenticated(false);
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