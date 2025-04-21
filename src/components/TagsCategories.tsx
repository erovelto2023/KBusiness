import React from "react";

export function TagsCategories({ tags = [], categories = [] }: { tags?: string[], categories?: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {categories.map(cat => (
        <span key={cat} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{cat}</span>
      ))}
      {tags.map(tag => (
        <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">#{tag}</span>
      ))}
    </div>
  );
}
