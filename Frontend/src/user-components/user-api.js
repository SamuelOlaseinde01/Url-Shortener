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

export async function getOptionalUser() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      return null; // Guest user — perfectly fine!
    }

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

export async function logoutUser() {
  const res = await fetch("http://localhost:3000/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
  return await res.json();
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

export async function getAllUrls() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/url", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
}

// user-components/user-api.js
export async function claimStoredGuestUrls() {
  const storedIds = JSON.parse(sessionStorage.getItem("guest_links") || "[]");

  console.log(storedIds);

  if (storedIds.length === 0) return;

  try {
    const res = await fetch("http://localhost:3000/api/v1/url/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Sends the auth cookie set during login/register
      body: JSON.stringify({ urlIds: storedIds }),
    });

    if (res.ok) {
      sessionStorage.removeItem("guest_links"); // Clear temporary storage
    }
  } catch (err) {
    console.error("Failed to claim guest links:", err);
  }
}
