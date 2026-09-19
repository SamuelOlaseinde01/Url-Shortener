import React from "react";
import { useLoaderData, redirect } from "react-router";
import { getOptionalUser, getUrl } from "./user-api";

export async function loader({ params }) {
  const user = await getOptionalUser();
  if (!user) {
    return redirect("/login");
  }
  const { id } = params;
  const url = await getUrl(id);
  return url;
}

export default function LinkDetailsPage() {
  const url = useLoaderData();
  const normalDateTime = url?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium", // Gives you "Sep 17, 2026"
        timeStyle: "short", // Gives you "10:32 AM"
      }).format(new Date(url.createdAt))
    : "";

  return (
    <div className="stats-container">
      <div className="stats">
        <p style={{ fontStyle: "italic" }}>_id: {url?.shortID}</p>
        <span>
          <h4>Original Url: </h4>
          <a href={`http://localhost:3000/${url?.originalUrl}`}>
            http://localhost:3000/{url?.originalUrl}
          </a>
        </span>
        <span>
          <h4>Shortened Url: </h4>
          <a href={`http://localhost:3000/${url?.shortenedUrl}`}>
            http://localhost:3000/{url?.shortenedUrl}
          </a>
        </span>

        <h4>Clicks: {url?.urlClickCount}</h4>
        <p style={{ fontStyle: "italic", color: "rgb(64, 64, 64)" }}>
          Created on: {normalDateTime}
        </p>
      </div>
    </div>
  );
}
