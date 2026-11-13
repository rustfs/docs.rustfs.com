const primaryColor = "rgba(255,150,255,0.3)";
const primaryTextColor = "rgb(255,150,255)";

/**
 * Social card used by the Takumi plugin. Home pages pass `compact` so the
 * longer SEO title and description wrap inside the 1200×630 image.
 */
export function docsOgCard({
  title,
  description,
  site,
  compact = false,
}: {
  title?: string;
  description?: string;
  site?: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "white",
        padding: "4rem",
        backgroundColor: "#0c0c0c",
        borderBottom: `18px solid ${primaryColor}`,
      }}
    >
      <p
        style={{
          fontWeight: 800,
          fontSize: compact ? "52px" : "82px",
          margin: 0,
        }}
      >
        {title}
      </p>
      {description ? (
        <p
          style={{
            fontSize: compact ? "34px" : "52px",
            color: "rgba(240,240,240,0.8)",
            margin: 0,
            marginTop: "16px",
            paddingBottom: "28px",
            borderBottom: `10px dashed ${primaryColor}`,
          }}
        >
          {description}
        </p>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
          marginTop: "auto",
          color: primaryTextColor,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="11" stroke={primaryTextColor} strokeWidth="2" />
        </svg>
        {site ? (
          <p
            style={{
              fontSize: compact ? "40px" : "56px",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {site}
          </p>
        ) : null}
      </div>
    </div>
  );
}
