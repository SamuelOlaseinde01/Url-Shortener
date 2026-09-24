import React from "react";
import { Check, Edit2, Trash, X } from "lucide-react";
import {
  useLoaderData,
  redirect,
  Form,
  useActionData,
  useNavigation,
} from "react-router";
import { deleteUrl, editUrl, getOptionalUser, getUrl } from "./user-api";

export async function loader({ params }) {
  const user = await getOptionalUser();
  if (!user) {
    return redirect("/login");
  }
  const { id } = params;
  const url = await getUrl(id);
  return url;
}

export async function action({ request, params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "delete") {
      await deleteUrl(id);
      return redirect("/");
    }

    if (intent === "update") {
      const originalUrl = formData.get("originalUrl");
      const previousUrl = formData.get("previousUrl");
      if (previousUrl === originalUrl) {
        const error = new Error(
          "The new URL must be different from the current original URL."
        );
        error.field = "originalUrl";
        throw error;
      }
      const obj = { id, originalUrl };
      const url = await editUrl(obj);
      return url;
    }
  } catch (err) {
    return {
      message: err.message,
      field: err.field,
    };
  }
}

export default function LinkDetailsPage() {
  const url = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [openEdit, setOpenEdit] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const [lastSavedUrl, setLastSavedUrl] = React.useState(url?.originalUrl);

  const isSubmitting = navigation.state === "submitting";

  const isDeleting =
    isSubmitting && navigation.formData?.get("intent") === "delete";
  const isUpdating =
    isSubmitting && navigation.formData?.get("intent") === "update";

  // If the action succeeds, React Router re-runs the loader.
  // When the component re-renders with the new URL, we catch it here and close the form.
  if (url?.originalUrl !== lastSavedUrl) {
    setLastSavedUrl(url?.originalUrl); // Update our tracker
    setIsEditing(false); // Close the edit input
    setOpenEdit(false); // Close the edit menu
  }

  const normalDateTime = url?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium", // Gives you "Sep 17, 2026"
        timeStyle: "short", // Gives you "10:32 AM"
      }).format(new Date(url.createdAt))
    : "";

  return (
    <div className="stats-container">
      <div className="buttons">
        <button
          disabled={isUpdating || isDeleting}
          onClick={() => setOpenEdit(!openEdit)}
        >
          {openEdit ? <X size={14} /> : <Edit2 size={12} />}
          {openEdit ? " Cancel" : " Edit"}
        </button>
        <Form method="post">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" value={url?.shortID} name="id" />
          <button disabled={isDeleting}>
            <Trash size={13} /> Delete
          </button>
        </Form>
      </div>

      <div className="stats">
        <p style={{ fontStyle: "italic" }}>_id: {url?.shortID}</p>
        <span>
          <h4>Original Url: </h4>
          {isEditing && openEdit ? (
            <Form method="post">
              <input type="hidden" name="intent" value="update" />
              <input
                type="hidden"
                name="previousUrl"
                value={url?.originalUrl}
              />
              <input
                type="text"
                name="originalUrl"
                // disabled={isUpdating}
                defaultValue={url?.originalUrl}
              />
              <button
                type="submit"
                disabled={isUpdating}
                aria-label="Save changes"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Check size={18} color="green" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Cancel editing"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={18} color="red" />
              </button>
            </Form>
          ) : (
            <div className="originalurl-container">
              <a href={`${url?.originalUrl}`}>{url?.originalUrl}</a>
              {openEdit && (
                <Edit2
                  size={16}
                  color="green"
                  cursor={"pointer"}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                />
              )}
            </div>
          )}
        </span>
        {actionData?.field && isEditing ? (
          <p className="error-text">{actionData?.message}</p>
        ) : null}
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
