import { fetchClient } from "./fetchClient";

export async function submitOnboarding(data) {
  return await fetchClient("/user/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function getAllPosts() {
  return await fetchClient("/posts");
}

export async function getPostById(postId) {
  return await fetchClient(`/posts/${postId}`);
}

export async function getMyPosts() {
  return await fetchClient("/posts/me");
}

export async function createPost(data) {
  return await fetchClient("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePost(postId, data) {
  return await fetchClient(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function cancelPost(postId) {
  return await fetchClient(`/posts/${postId}/cancel`, {
    method: "PATCH",
  });
}