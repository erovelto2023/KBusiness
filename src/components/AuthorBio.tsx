import React from "react";

export function AuthorBio({ author }: { author: string }) {
  // TODO: Replace with real author info (photo, links, etc)
  return (
    <div className="flex items-center gap-3 mt-8 mb-4 p-4 bg-blue-50 rounded-xl">
      <img src="https://api.dicebear.com/7.x/initials/svg?seed=" alt={author} className="w-12 h-12 rounded-full border border-blue-200 bg-white" />
      <div>
        <div className="font-bold text-blue-900">{author}</div>
        <div className="text-xs text-gray-500">Author bio coming soon.</div>
      </div>
    </div>
  );
}
