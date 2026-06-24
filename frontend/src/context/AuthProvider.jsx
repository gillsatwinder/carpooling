import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  
  const isAuthenticated = !!token;

  const login = (jwtToken) => {
   
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("onboarding");
    setToken(null);

  };



  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}