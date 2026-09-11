import { redirect } from "react-router";

export async function register(creds) {
  const res = await fetch("http://localhost:3000/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(creds),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(
      data?.msg || "Something went wrong. Please try again."
    );
    error.field = data?.field;
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function login(creds) {
  const res = await fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(creds),
  });
  const data = res.json();
  if (!res.ok) {
    const error = new Error(
      data?.msg || "Something went wrong. Please try again."
    );
    error.field = data?.field;
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function getOptionalUser() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return null; // Guest user — perfectly fine!
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return null; // Network failure or offline — treat as guest
  }
}

export async function requireAuth() {
  const user = await getOptionalUser();
  if (!user) {
    return redirect("/login");
  }
  return user;
}

export async function createUrl(originalUrl) {
  const res = await fetch("http://localhost:3000/api/v1/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(originalUrl),
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(
      data?.msg || "Something went wrong. Please try again."
    );
    error.field = data?.field;
    error.status = res.status;
    throw error;
  }
  return data;
}
