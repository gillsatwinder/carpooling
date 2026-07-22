const BASE_URL = "http://localhost:8080";

export async function fetchClient(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Detect if the request body is FormData
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);


  if (!res.ok) {

      const error = new Error(
      data?.error || "Request failed"
    );

    error.status = res.status;
    error.data = data;
    throw error;

  }

  return data;
}