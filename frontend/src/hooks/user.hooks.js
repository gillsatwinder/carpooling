import { fetchClient } from "./fetchClient";

export async function submitOnboarding(data) {
  return await fetchClient("/user/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
}