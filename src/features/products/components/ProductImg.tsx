import { useState } from "react";
import { cn } from "../../../utils/cn";

export function ProductImg({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  const [errored, setErrored] = useState(false);
  const initials = alt
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();

  if (errored) {
    return (
      <div
        className={cn(
          "shrink-0 bg-avatar-fallback text-avatar-fallback font-extrabold flex items-center justify-center",
          size > 60 ? "rounded-xl" : "rounded-lg",
        )}
        style={{ width: size, height: size, fontSize: size * 0.24 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={cn(
        "block shrink-0 object-cover",
        size > 60 ? "rounded-xl" : "rounded-lg",
      )}
      style={{ width: size, height: size }}
    />
  );
}
