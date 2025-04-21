import React from "react";

export function TableOfContents({ html }: { html: string }) {
  // Parse headings from HTML
  const headings = Array.from(html.matchAll(/<h([1-4])[^>]*>(.*?)<\/h\1>/gi)).map(([, level, text], i) => ({
    id: `toc-${i}`,
    text: text.replace(/<[^>]+>/g, ''),
    level: parseInt(level)
  }));
  if (!headings.length) return null;
  return (
    <nav className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="text-xs font-bold mb-2 text-gray-500 uppercase">Table of Contents</div>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} style={{ marginLeft: (h.level - 1) * 16 }}>
            <a href={`#${h.id}`} className="text-blue-700 hover:underline text-sm">{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
