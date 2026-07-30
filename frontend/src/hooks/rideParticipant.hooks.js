import { fetchClient } from "./fetchClient";

export async function getParticipants(postId) {
  return await fetchClient(`/posts/${postId}/participants`);
}

export async function joinRide(postId, role) {
  return await fetchClient(`/posts/${postId}/participants`, {
    method: "POST",
    body: JSON.stringify({ role }),
  });
}
export async function acceptParticipant(participantId) {
  return await fetchClient(`/participants/${participantId}/accept`, {
    method: "PATCH",
  });
}

export async function rejectParticipant(participantId) {
  return await fetchClient(`/participants/${participantId}/reject`, {
    method: "PATCH",
  });
}

export async function cancelRequest(participantId) {
  return await fetchClient(`/participants/${participantId}/cancel`, {
    method: "PATCH",
  });
}

export async function leaveRide(participantId) {
  return await fetchClient(`/participants/${participantId}`, {
    method: "DELETE",
  });
}

export async function getMyJoinedRides() {
  return await fetchClient(`/participants/my-rides`);
}