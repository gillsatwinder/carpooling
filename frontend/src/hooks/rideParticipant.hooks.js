import { fetchClient } from "./fetchClient";

export async function getParticipants(postId) {
  return await fetchClient(`/posts/${postId}/participants`);
}

export async function joinRide(postId, data) {
  return await fetchClient(`/posts/${postId}/participants`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}