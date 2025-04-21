import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";

export function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const q = query(collection(db, "comments"), where("postId", "==", postId));
    const unsub = onSnapshot(q, snap => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !text.trim()) {
      setError("Name and comment are required.");
      return;
    }
    // Simple spam prevention: limit to 1 comment per minute per name
    const last = comments.find(c => c.name === name);
    if (last && Date.now() - new Date(last.createdAt).getTime() < 60000) {
      setError("Please wait before posting again.");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        postId,
        name,
        text,
        createdAt: serverTimestamp(),
        approved: false // moderation: set to true when approved
      });
      setText("");
      setError("Comment submitted for review.");
    } catch (err) {
      setError("Failed to submit comment.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12">
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      {comments.filter(c => c.approved).length === 0 && <div className="text-gray-500 mb-2">No comments yet.</div>}
      {comments.filter(c => c.approved).map((c, i) => (
        <div key={i} className="mb-4 border-b pb-2">
          <div className="font-semibold">{c.name}</div>
          <div className="text-xs text-gray-500 mb-1">{c.createdAt?.toDate?.().toLocaleString?.() || ""}</div>
          <div>{c.text}</div>
        </div>
      ))}
      <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your name" className="border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        <textarea placeholder="Add a comment..." className="border rounded px-3 py-2" value={text} onChange={e => setText(e.target.value)} />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded self-end" disabled={submitting}>Post Comment</button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
}
