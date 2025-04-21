import React from "react";

export function ReadingTime({ content }: { content: string }) {
  // Roughly 200 words per minute
  const words = content ? content.replace(/<[^>]+>/g, '').split(/\s+/).length : 0;
  const mins = Math.max(1, Math.round(words / 200));
  return (
    <span className="text-sm text-gray-500">Estimated reading time: {mins} min{mins > 1 ? 's' : ''}</span>
  );
}
