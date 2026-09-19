import { Check, Copy, Link2 } from "lucide-react";
import React from "react";
import { Link } from "react-router";

export default function LinkCard({ url }) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [copyError, setCopyError] = React.useState(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/${url.shortenedUrl}`
      );
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      setCopyError(error.message);
    }
  }
  return (
    <div className="link-card-container">
      <div className="links-logo-info">
        <Link2 />
        <div className="links-info">
          <Link to={`http://localhost:3000/${url.shortenedUrl}`}>
            http://localhost:3000/{url.shortenedUrl}
          </Link>
          <p>{url.originalUrl}</p>
        </div>
      </div>
      <div className="link-clicks">
        <p onClick={handleCopy}>
          {!isCopied ? <Copy size={16} /> : <Check size={16} />}
          {!isCopied ? "Copy" : "Copied"}
        </p>
        <Link to={`/${url.shortID}`}>View details</Link>
      </div>
    </div>
  );
}
