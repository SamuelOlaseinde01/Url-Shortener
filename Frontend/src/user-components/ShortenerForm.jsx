import React from "react";
import { Form } from "react-router";
import { Copy, Check } from "lucide-react";

export default function ShortenerForm(props) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [errMessage, setErrMessage] = React.useState(props.newUrl?.message);
  const shortenedUrl = props.newUrl?.shortenedUrl;
  const navigation = props.navigation;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      setErrMessage(error.message);
    }
  }

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
        {errMessage && <p className="error-text">{errMessage}</p>}
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
        <span className="shortened-link-container">
          Shortended Url:
          <a href={shortenedUrl} target="_blank">
            {`http://localhost:3000/${shortenedUrl}`}
          </a>
          {isCopied ? (
            <Check color="blue" size={17} cursor={"pointer"} />
          ) : (
            <Copy
              color="blue"
              size={17}
              cursor={"pointer"}
              onClick={handleCopy}
            />
          )}
        </span>
      )}
    </div>
  );
}
