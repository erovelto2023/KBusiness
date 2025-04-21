import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

const emojis = ["👍", "❤️", "😂", "😮", "🎉", "👎"];

export function Reactions({ postId }: { postId: string }) {
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [reacted, setReacted] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReactions() {
      const ref = doc(db, "blogPosts", postId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCounts(snap.data().reactions || {});
      }
    }
    fetchReactions();
  }, [postId]);

  const handleReact = async (emoji: string) => {
    if (reacted) return;
    setReacted(emoji);
    setCounts(prev => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    const ref = doc(db, "blogPosts", postId);
    await updateDoc(ref, { [`reactions.${emoji}`]: increment(1) });
  };

  return (
    <div className="flex gap-2 mt-3">
      {emojis.map(e => (
        <button key={e} onClick={() => handleReact(e)} disabled={!!reacted} className={`text-2xl px-2 py-1 rounded ${reacted === e ? 'bg-blue-100' : 'bg-white hover:bg-blue-50'} transition`}>
          {e} <span className="text-sm">{counts[e] || 0}</span>
        </button>
      ))}
    </div>
  );
}
