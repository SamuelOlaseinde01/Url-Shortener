import React from "react";
import ShortenerForm from "./ShortenerForm";
import { useActionData, useNavigation } from "react-router";
import { createUrl } from "./apiFunctions";

export async function action({ request }) {
  const formData = await request.formData();
  const originalUrl = formData.get("originalUrl");
  const newUrl = await createUrl({ originalUrl });
  return newUrl;
}

export default function HomePage() {
  const newUrl = useActionData();
  const navigation = useNavigation();
  return (
    <div className="component-container">
      <ShortenerForm newUrl={newUrl} navigation={navigation} />
    </div>
  );
}
