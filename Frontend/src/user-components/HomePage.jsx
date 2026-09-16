import React, { useEffect } from "react";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "react-router";
import ShortenerForm from "./ShortenerForm";
import { createUrl, getAllUrls } from "./user-api";
import LinkHistory from "./LinkHistory";

export async function loader() {
  try {
    const urls = await getAllUrls();
    return urls;
  } catch (err) {
    return []; // Return an empty array rather than the raw error to prevent render crashes
  }
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const originalUrl = formData.get("originalUrl");
    const newUrl = await createUrl({ originalUrl });
    return newUrl;
  } catch (error) {
    return error;
  }
}

export default function HomePage() {
  const urls = useLoaderData();
  const user = useOutletContext();
  const newUrl = useActionData();
  const navigation = useNavigation();

  useEffect(() => {
    const urlId = newUrl?._id;

    if (!user && urlId) {
      const existing = JSON.parse(
        sessionStorage.getItem("guest_links") || "[]"
      );
      if (!existing.includes(urlId)) {
        existing.push(urlId);
        sessionStorage.setItem("guest_links", JSON.stringify(existing));
      }
    }
  }, [newUrl, user]);

  const hasNewLink = Boolean(newUrl?._id);

  return (
    <div className="component-container">
      <ShortenerForm newUrl={newUrl} navigation={navigation} />
      {user || hasNewLink ? <LinkHistory newUrl={newUrl} urls={urls} /> : null}
    </div>
  );
}
