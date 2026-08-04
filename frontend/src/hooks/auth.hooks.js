import { fetchClient } from "./fetchClient";

export async function registerUser({ email, password, name}) {
  return await fetchClient("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password,name}),
  });
}

export async function loginUser({ email, password }) {
  return await fetchClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyOtp({ userId, otp }) {
  return await fetchClient("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ userId, otp }),
  });
}

export async function resendOtp({ email }) {
  return await fetchClient("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function logout() {
  // Remove the JWT token
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("onboarded");
  sessionStorage.clear();
}