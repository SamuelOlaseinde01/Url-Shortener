import React, { useState } from "react";
import {
  Check,
  Copy,
  Link2,
  ExternalLink,
  MousePointerClick,
  Calendar,
  ArrowRight,
  Globe,
} from "lucide-react";
import { Link } from "react-router";

export default function LinkCard({ url, isGuest }) {
  const [isCopied, setIsCopied] = useState(false);

  const fullShortUrl = `http://localhost:3000/${url.shortenedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }

  const formattedDate = url.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(url.createdAt))
    : null;

  return (
    <div className="link-card-item">
      <div className="link-card-left">
        <div className="link-icon-circle">
          <Link2 size={18} />
        </div>
        <div className="link-text-details">
          <div className="link-short-row">
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-short-url"
              title="Visit shortened URL"
            >
              <span>{fullShortUrl}</span>
              <ExternalLink size={12} className="link-ext-icon" />
            </a>
          </div>

          <div className="link-orig-row">
            <Globe size={13} className="globe-icon" />
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-original-url"
              title={url.originalUrl}
            >
              {url.originalUrl}
            </a>
          </div>

          <div className="link-meta-row">
            {formattedDate && (
              <span className="link-meta-item">
                <Calendar size={13} />
                <span>{formattedDate}</span>
              </span>
            )}
            <span className="link-meta-item clicks-badge">
              <MousePointerClick size={13} />
              <span>
                {url.urlClickCount || 0}{" "}
                {url.urlClickCount === 1 ? "click" : "clicks"}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="link-card-actions">
        <button
          type="button"
          onClick={handleCopy}
          className={`card-copy-btn ${isCopied ? "copied" : ""}`}
          title="Copy short link"
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          <span>{isCopied ? "Copied!" : "Copy"}</span>
        </button>

        {!isGuest && url.shortID ? (
          <Link
            to={`/${url.shortID}`}
            className="card-details-btn"
            title="View link statistics and manage"
          >
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
