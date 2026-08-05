import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
   const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem("onboarded") === "true"
  );
  //getting the user 
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token;

  const login = (jwtToken, isOnboarded = false, userData = null) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("onboarded", isOnboarded);

    setToken(jwtToken);
    setOnboarded(isOnboarded);
   
    //added user
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };
  const completeOnboarding = () => {
    localStorage.setItem("onboarded", "true");
    setOnboarded(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("onboarded");
    localStorage.removeItem("user");
    setToken(null);
    setOnboarded(false);
    setUser(null);
  };

  const updateUserRole = (role) => {
  setUser((prevUser) => {
    if (!prevUser) return prevUser;

    const updatedUser = {
      ...prevUser,
      role,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser;
  });
};



  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        onboarded,
        user,
        login,
        completeOnboarding,
        logout,
        updateUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}