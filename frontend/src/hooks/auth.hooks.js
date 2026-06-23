import { fetchClient } from "./fetchClient";

export async function registerUser({ email, password }) {
  return await fetchClient("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}