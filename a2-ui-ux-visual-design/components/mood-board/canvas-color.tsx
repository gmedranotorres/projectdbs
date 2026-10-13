"use client";

// Paints the browser canvas (the area behind the page, seen when you scroll
// past its edge) in a board's color, and sets light or dark scrollbars.
//
// Next.js keeps a page mounted but hidden after you leave it, so this style
// switches itself off while hidden; otherwise the color would follow you
// back to the hub. See "Global styles" in the Next.js guide on preserving
// UI state.
export function CanvasColor({
  color,
  scheme = "light",
}: {
  color: string;
  scheme?: "light" | "dark";
}) {
  return (
    <style
      ref={(style) => {
        if (style) style.media = "";
        return () => {
          if (style) style.media = "not all";
        };
      }}
    >{`html { background-color: ${color}; color-scheme: ${scheme}; }`}</style>
  );
}
