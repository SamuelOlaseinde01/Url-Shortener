import React, { useState, useMemo } from "react";
import LinkCard from "./LinkCard";
import { Link, useOutletContext } from "react-router";
import { Search, Link2 } from "lucide-react";

export default function LinkHistory({ urls = [], newUrl }) {
  const user = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter backend-sorted urls based on search query
  const filteredUrls = useMemo(() => {
    if (!searchQuery.trim()) return urls;
    const q = searchQuery.toLowerCase().trim();
    return urls.filter(
      (u) =>
        u.originalUrl?.toLowerCase().includes(q) ||
        u.shortenedUrl?.toLowerCase().includes(q) ||
        u.shortID?.toLowerCase().includes(q)
    );
  }, [urls, searchQuery]);

  return (
    <div className="history-section-wrapper">
      <div className="history-header">
        <div className="history-heading-group">
          <h3>Your Recent Links</h3>
          {user && urls.length > 0 && (
            <span className="history-count-badge">
              {urls.length} {urls.length === 1 ? "link" : "links"}
            </span>
          )}
        </div>

        {user && urls.length > 2 && (
          <div className="history-search-wrapper">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="history-search-input"
            />
          </div>
        )}
      </div>

      {user ? (
        filteredUrls.length > 0 ? (
          <div className="link-cards-list">
            {filteredUrls.map((url) => (
              <LinkCard key={url.shortID} url={url} isGuest={false} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="history-empty-state">
            <p>No links matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="history-empty-state">
            <Link2 size={28} className="empty-icon" />
            <p>No links shortened yet. Shorten a link above to see it here!</p>
          </div>
        )
      ) : (
        <div className="guest-history-banner">
          <p>
            <Link to="/login" className="guest-action-link">
              Sign in
            </Link>{" "}
            or{" "}
            <Link to="/register" className="guest-action-link">
              Create an account
            </Link>{" "}
            to view and manage all the links you've created.
          </p>
        </div>
      )}
    </div>
  );
}
