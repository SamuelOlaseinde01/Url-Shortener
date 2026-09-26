import React, { useState } from "react";
import {
  Check,
  Copy,
  Edit2,
  Trash2,
  X,
  ArrowLeft,
  ExternalLink,
  MousePointerClick,
  Calendar,
  Link2,
  Globe,
  AlertCircle,
  Hash,
} from "lucide-react";
import {
  useLoaderData,
  redirect,
  Form,
  useActionData,
  useNavigation,
  Link,
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

  const [openEdit, setOpenEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [lastSavedUrl, setLastSavedUrl] = useState(url?.originalUrl);

  const isSubmitting = navigation.state === "submitting";
  const isDeleting =
    isSubmitting && navigation.formData?.get("intent") === "delete";
  const isUpdating =
    isSubmitting && navigation.formData?.get("intent") === "update";

  // When data updates following a successful action loader re-fetch, reset the editing state
  if (url?.originalUrl !== lastSavedUrl) {
    setLastSavedUrl(url?.originalUrl);
    setIsEditing(false);
    setOpenEdit(false);
  }

  const normalDateTime = url?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(url.createdAt))
    : "Unknown date";

  const fullShortUrl = `http://localhost:3000/${url?.shortenedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  function toggleEditMode() {
    if (openEdit || isEditing) {
      setOpenEdit(false);
      setIsEditing(false);
    } else {
      setOpenEdit(true);
      setIsEditing(true);
    }
  }

  return (
    <div className="link-details-page-wrapper">
      <div className="link-details-container">
        {/* Navigation / Header */}
        <div className="details-top-bar">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Links</span>
          </Link>

          <div className="details-header-actions">
            <button
              type="button"
              className={`btn-action-edit ${openEdit || isEditing ? "active" : ""}`}
              disabled={isUpdating || isDeleting}
              onClick={toggleEditMode}
            >
              {openEdit || isEditing ? <X size={15} /> : <Edit2 size={15} />}
              <span>{openEdit || isEditing ? "Cancel Edit" : "Edit URL"}</span>
            </button>

            <Form
              method="post"
              onSubmit={(e) => {
                if (
                  !window.confirm(
                    "Are you sure you want to delete this link? This action cannot be undone."
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" value={url?.shortID} name="id" />
              <button
                type="submit"
                disabled={isDeleting || isUpdating}
                className="btn-action-delete"
              >
                <Trash2 size={15} />
                <span>{isDeleting ? "Deleting..." : "Delete Link"}</span>
              </button>
            </Form>
          </div>
        </div>

        {/* Main Details Card */}
        <div className="details-main-card">
          <div className="details-card-header">
            <div className="details-title-group">
              <div className="details-icon-badge">
                <Link2 size={22} />
              </div>
              <div>
                <h2>Link Details</h2>
                <p className="details-subtitle">
                  Manage and monitor your shortened link
                </p>
              </div>
            </div>
            <div className="details-id-tag">
              <Hash size={13} />
              <span>{url?.shortID}</span>
            </div>
          </div>

          <div className="details-card-body">
            {/* Shortened URL Section */}
            <div className="details-section">
              <label className="section-label">Shortened URL</label>
              <div className="short-url-box">
                <a
                  href={fullShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-url-link"
                >
                  {fullShortUrl}
                  <ExternalLink size={14} className="external-icon" />
                </a>

                <div className="short-url-actions">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`btn-copy-link ${isCopied ? "copied" : ""}`}
                  >
                    {isCopied ? <Check size={15} /> : <Copy size={15} />}
                    <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Original Destination URL Section */}
            <div className="details-section">
              <div className="destination-header">
                <label className="section-label">Destination URL</label>
                {!(openEdit || isEditing) && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenEdit(true);
                      setIsEditing(true);
                    }}
                    className="inline-edit-trigger"
                  >
                    <Edit2 size={13} />
                    <span>Change destination</span>
                  </button>
                )}
              </div>

              {openEdit || isEditing ? (
                <Form method="post" className="details-edit-form">
                  <input type="hidden" name="intent" value="update" />
                  <input
                    type="hidden"
                    name="previousUrl"
                    value={url?.originalUrl}
                  />

                  <div className="edit-input-wrapper">
                    <Globe size={18} className="input-globe-icon" />
                    <input
                      type="url"
                      name="originalUrl"
                      required
                      defaultValue={url?.originalUrl}
                      placeholder="https://example.com/your-target-url"
                      className="details-edit-input"
                      autoFocus
                    />
                  </div>

                  {actionData?.message && (
                    <div className="edit-error-banner">
                      <AlertCircle size={15} />
                      <span>{actionData?.message}</span>
                    </div>
                  )}

                  <div className="edit-form-buttons">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn-save-edit"
                    >
                      <Check size={15} />
                      <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setOpenEdit(false);
                      }}
                      disabled={isUpdating}
                      className="btn-cancel-edit"
                    >
                      <X size={15} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </Form>
              ) : (
                <div className="destination-display-box">
                  <Globe size={18} className="destination-globe-icon" />
                  <a
                    href={url?.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="original-url-link"
                    title={url?.originalUrl}
                  >
                    {url?.originalUrl}
                  </a>
                  <a
                    href={url?.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-visit-original"
                    title="Open destination in new tab"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              )}
            </div>

            {/* Metrics & Metadata Grid */}
            <div className="details-metrics-grid">
              <div className="metric-card">
                <div className="metric-icon-wrapper clicks">
                  <MousePointerClick size={20} />
                </div>
                <div className="metric-info">
                  <span className="metric-title">Total Clicks</span>
                  <span className="metric-value">
                    {url?.urlClickCount ?? 0}
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-wrapper calendar">
                  <Calendar size={20} />
                </div>
                <div className="metric-info">
                  <span className="metric-title">Created On</span>
                  <span className="metric-value-text">{normalDateTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
