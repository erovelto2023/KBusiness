import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

export function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchLikes() {
      const ref = doc(db, "blogPosts", postId);
      const snap = await getDoc(ref);
      setLikes(snap.exists() && snap.data().likes ? snap.data().likes : 0);
    }
    fetchLikes();
  }, [postId]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikes(likes + 1);
    const ref = doc(db, "blogPosts", postId);
    await updateDoc(ref, { likes: increment(1) });
  };

  return (
    <button onClick={handleLike} disabled={liked} className={`flex items-center gap-1 px-3 py-1 rounded border ${liked ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-green-50'} transition`}>
      <span role="img" aria-label="like">👍</span> {likes}
    </button>
  );
}
