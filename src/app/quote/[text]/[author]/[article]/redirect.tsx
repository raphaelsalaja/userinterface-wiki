"use client";

import { useEffect } from "react";

interface QuoteRedirectProps {
  redirectUrl: string;
  quoteText: string;
  articleTitle: string;
}

function QuoteRedirect({
  redirectUrl,
  quoteText,
  articleTitle,
}: QuoteRedirectProps) {
  useEffect(() => {
    window.location.replace(redirectUrl);
  }, [redirectUrl]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      <blockquote
        style={{
          maxWidth: "600px",
          fontFamily: "var(--font-family-serif, Georgia, serif)",
          fontSize: "18px",
          fontStyle: "italic",
          lineHeight: 1.6,
        }}
      >
        "{quoteText}"
      </blockquote>
      <p style={{ color: "var(--gray-11)", fontSize: "14px" }}>
        From "{articleTitle}"
      </p>
      <p style={{ color: "var(--gray-10)", fontSize: "13px" }}>
        Redirecting...
      </p>
    </div>
  );
}

export { QuoteRedirect };
