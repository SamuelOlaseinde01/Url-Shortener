export async function createUrl(originalUrl) {
  const res = await fetch("http://localhost:3000/api/v1/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(originalUrl),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res}`);
  }
  const data = await res.json();
  return data;
}
