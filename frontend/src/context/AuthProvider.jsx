import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
   const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem("onboarded") === "true"
  );
  
  const isAuthenticated = !!token;

  const login = (jwtToken, isOnboarded = false) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("onboarded", isOnboarded);

    setToken(jwtToken);
    setOnboarded(isOnboarded);
  };
  const completeOnboarding = () => {
    localStorage.setItem("onboarded", "true");
    setOnboarded(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("onboarded");
    setToken(null);
    setOnboarded(false);
  };



  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        onboarded,
        login,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}