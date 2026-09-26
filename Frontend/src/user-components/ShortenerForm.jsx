import React, { useState } from "react";
import { Form, Link } from "react-router";
import {
  Copy,
  Check,
  Link2,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function ShortenerForm({ newUrl, navigation, user }) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState(null);

  const serverError = newUrl?.message;
  const shortenedUrl = newUrl?.shortenedUrl;
  const shortID = newUrl?.shortID;

  const activeErrorMessage = copyError || serverError;
  const isSubmitting = navigation.state === "submitting";

  const fullShortUrl = shortenedUrl
    ? `http://localhost:3000/${shortenedUrl}`
    : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      setCopyError("Failed to copy link.");
    }
  }

  return (
    <div className="hero-shortener-wrapper">
      {/* Hero Header */}
      <div className="hero-text-container">
        <div className="hero-pill-badge">
          <Sparkles size={14} className="pill-icon" />
          <span>Fast, Simple & Free URL Shortener</span>
        </div>
        <h1 className="hero-main-title">
          Make Every Link <span className="highlight-text">Shorter & Smarter</span>
        </h1>
        <p className="hero-description">
          Transform unwieldy URLs into clean, trackable links in one click.
          Monitor clicks, manage destinations, and share seamlessly.
        </p>
      </div>

      {/* Main Shortener Form Card */}
      <div className="shortener-card">
        <Form method="post" className="shortener-input-form">
          <div className="shortener-input-wrapper">
            <Link2 size={20} className="shortener-link-icon" />
            <input
              type="url"
              name="originalUrl"
              placeholder="Paste your long link here (e.g., https://example.com/very-long-url...)"
              required
              autoComplete="off"
              className="shortener-text-input"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="shortener-submit-btn"
            >
              <span>{isSubmitting ? "Shortening..." : "Shorten URL"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </Form>

        {activeErrorMessage && (
          <div className="shortener-error-banner">
            <p>{activeErrorMessage}</p>
          </div>
        )}

        {/* Success Output Box */}
        {shortenedUrl && (
          <div className="shortener-success-card">
            <div className="success-header">
              <span className="success-badge">
                <Check size={13} /> Link Shortened Successfully
              </span>
            </div>

            <div className="success-content-row">
              <div className="success-url-info">
                <a
                  href={fullShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="success-short-link"
                >
                  <span>{fullShortUrl}</span>
                  <ExternalLink size={14} className="ext-icon" />
                </a>
              </div>

              <div className="success-action-group">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`btn-success-copy ${isCopied ? "copied" : ""}`}
                >
                  {isCopied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                </button>

                {user && shortID && (
                  <Link to={`/${shortID}`} className="btn-success-manage">
                    <span>Manage</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
