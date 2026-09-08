import React from "react";
import { Form } from "react-router";

export default function ShortenerForm(props) {
  const shortenedUrl = props.newUrl?.shortenedUrl;
  const navigation = props.navigation;
  const message = props.newUrl?.message;
  return (
    <div className="url-form-container">
      <div className="url-heading-container">
        <h2>URL Shortener</h2>
      </div>
      <Form method="post" className="url-form">
        <input
          type="text"
          name="originalUrl"
          placeholder="Enter the link here"
          required
        />
        {message && <p className="error-text">{message}</p>}
        <button
          className={
            navigation.state === "submitting"
              ? "url-submitting-btn"
              : "url-submit-btn"
          }
        >
          {navigation.state === "submitting" ? "Submitting" : "Submit"}
        </button>
      </Form>
      {shortenedUrl && (
        <span>
          Shortended Url:{" "}
          <a href={shortenedUrl} target="_blank">
            {`http://localhost:3000/${shortenedUrl}`}
          </a>
        </span>
      )}
    </div>
  );
}
