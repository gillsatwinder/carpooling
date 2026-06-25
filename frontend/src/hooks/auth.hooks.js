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