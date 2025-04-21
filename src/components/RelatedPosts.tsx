import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function RelatedPosts({ tags = [], currentId }: { tags: string[], currentId: string }) {
  const [related, setRelated] = useState<any[]>([]);
  useEffect(() => {
    if (!tags.length) return;
    const q = query(collection(db, "blogPosts"), where("tags", "array-contains-any", tags));
    const unsub = onSnapshot(q, snap => {
      setRelated(snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.id !== currentId)
        .slice(0, 3)
      );
    });
    return () => unsub();
  }, [tags, currentId]);
  if (!related.length) return null;
  return (
    <div className="mt-16">
      <h3 className="text-lg font-bold mb-4">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(post => (
          <a key={post.id} href={`/blog/${post.slug}`} className="block bg-gray-50 rounded-xl shadow p-4 hover:shadow-lg transition">
            {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full h-24 object-cover rounded mb-2" />}
            <div className="font-semibold text-blue-700 mb-1">{post.title}</div>
            <div className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()} by {post.author}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
