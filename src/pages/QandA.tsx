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

interface QA {
  id: string;
  program: string;
  platform: string;
  question: string;
  answer: string;
  createdAt: any;
}

const QandA = () => {
  const [qas, setQAs] = useState<QA[]>([]);
  const [form, setForm] = useState<Omit<QA, "id" | "createdAt">>({ program: "", platform: "", question: "", answer: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Example program options (replace with real data if needed)
  const programOptions = ["Program A", "Program B", "Program C"]; 

  useEffect(() => {
    const qQAs = query(collection(db, "qAndA"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qQAs, (snap) => {
      setQAs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as QA)));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "qAndA", editing), { ...form });
        setEditing(null);
      } else {
        await addDoc(collection(db, "qAndA"), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      setForm({ program: "", platform: "", question: "", answer: "" });
      setShowModal(false);
    } catch {
      alert("Failed to save Q&A");
    }
    setLoading(false);
  };

  const handleEdit = (qa: QA) => {
    setEditing(qa.id);
    setForm({ program: qa.program, platform: qa.platform, question: qa.question, answer: qa.answer });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this Q&A?")) return;
    await deleteDoc(doc(db, "qAndA", id));
    if (editing === id) setEditing(null);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Q & A</h1>
          <Button className="bg-affiliate-purple hover:bg-affiliate-purple/90" onClick={() => { setShowModal(true); setEditing(null); setForm({ program: "", platform: "", question: "", answer: "" }); }}>
            Add New Q&A Response
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qas.length === 0 && <div className="text-gray-500 col-span-full">No Q&A yet.</div>}
          {qas.map((qa) => (
            <div key={qa.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="font-semibold text-lg mb-1">{qa.program}</div>
              <div className="text-sm text-gray-600 mb-1">Platform: {qa.platform}</div>
              <div className="mb-2 text-gray-800 whitespace-pre-line font-medium">Q: {qa.question}</div>
              <div className="mb-4 text-gray-700 whitespace-pre-line">A: {qa.answer}</div>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline" onClick={() => handleEdit(qa)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(qa.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Add/Edit Q&A Response */}
        {showModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative">
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => { setShowModal(false); setEditing(null); }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6">{editing ? "Edit Q&A Response" : "Add New Q&A Response"}</h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block font-medium mb-1">Program</label>
                  <select
                    name="program"
                    value={form.program}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  >
                    <option value="">Select Program</option>
                    {programOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Platform</label>
                  <Input
                    name="platform"
                    placeholder="e.g., Quora, Reddit, Facebook"
                    value={form.platform}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Question</label>
                  <textarea
                    name="question"
                    placeholder="Enter the question..."
                    value={form.question}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base min-h-[70px]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Answer</label>
                  <textarea
                    name="answer"
                    placeholder="Write your answer here..."
                    value={form.answer}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base min-h-[70px]"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {editing ? (loading ? "Saving..." : "Save Changes") : loading ? "Adding..." : "Add Response"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QandA;
