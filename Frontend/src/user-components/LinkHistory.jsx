import React from "react";
import LinkCard from "./LinkCard";
import { Link, useOutletContext } from "react-router";

export default function LinkHistory({ urls, newUrl }) {
  // The idea for the optional chaining goes thus:
  // if there is a new url created by a guest user, we want that h3 to show
  // likewise, if the person is a logged in user, we want it to show if and only if, they have an history before or they just created one

  const user = useOutletContext();
  let links;
  console.log(urls);
  if (urls.length > 0) {
    links = urls.map((url) => {
      return <LinkCard key={url.shortID} url={url} />;
    });
  }

  return (
    <div>
      {newUrl?._id || urls.length > 0 ? <h3>Your Recent Links:</h3> : null}
      {user || urls.length > 0 ? (
        <div style={{ marginTop: "10px" }}>{links}</div>
      ) : (
        <p
          style={{
            color: "gray",
            textAlign: "center",
            margin: "30px",
            fontStyle: "italic",
          }}
        >
          <Link
            style={{
              // textDecoration: "none",
              fontWeight: "500",
              color: "black",
            }}
            to={"/login"}
          >
            Sign in
          </Link>{" "}
          to view recent links you created
        </p>
      )}
    </div>
  );
}
