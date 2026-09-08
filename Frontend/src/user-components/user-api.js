export async function createUrl(originalUrl) {
  const res = await fetch("http://localhost:3000/api/v1/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
