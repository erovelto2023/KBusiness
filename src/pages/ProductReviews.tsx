import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface Review {
  id: string;
  title: string;
  product: string;
  content: string;
  createdAt: any;
}

const ProductReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState<Omit<Review, "id" | "createdAt">>({ title: "", product: "", content: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qReviews = query(collection(db, "productReviews"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qReviews, (snap) => {
      setReviews(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review)));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "productReviews", editing), { ...form });
        setEditing(null);
      } else {
        await addDoc(collection(db, "productReviews"), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      setForm({ title: "", product: "", content: "" });
    } catch {
      alert("Failed to save review");
    }
    setLoading(false);
  };

  const handleEdit = (review: Review) => {
    setEditing(review.id);
    setForm({ title: review.title, product: review.product, content: review.content });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteDoc(doc(db, "productReviews", id));
    if (editing === id) setEditing(null);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Product Reviews</h1>
        <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              name="title"
              placeholder="Review Title"
              value={form.title}
              onChange={handleChange}
              required
              className="md:w-1/4"
            />
            <Input
              name="product"
              placeholder="Product Name"
              value={form.product}
              onChange={handleChange}
              required
              className="md:w-1/4"
            />
          </div>
          <textarea
            name="content"
            placeholder="Review Content"
            value={form.content}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {editing ? (loading ? "Saving..." : "Save Changes") : loading ? "Adding..." : "Add Review"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: "", product: "", content: "" }); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length === 0 && <div className="text-gray-500 col-span-full">No reviews yet.</div>}
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="font-semibold text-lg mb-1">{review.title}</div>
              <div className="text-sm text-gray-600 mb-2">Product: {review.product}</div>
              <div className="mb-4 text-gray-700 whitespace-pre-line">{review.content}</div>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline" onClick={() => handleEdit(review)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(review.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
