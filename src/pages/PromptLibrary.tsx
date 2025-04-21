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

interface Prompt {
  id: string;
  name: string;
  type: string;
  content: string;
  createdAt: any;
}

const PromptLibrary = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [form, setForm] = useState<Omit<Prompt, "id" | "createdAt">>({ name: "", type: "Text", content: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const promptTypes = ["Text", "Image", "Video"]; 

  useEffect(() => {
    const qPrompts = query(collection(db, "promptLibrary"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qPrompts, (snap) => {
      setPrompts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Prompt)));
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
        await updateDoc(doc(db, "promptLibrary", editing), { ...form });
        setEditing(null);
      } else {
        await addDoc(collection(db, "promptLibrary"), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      setForm({ name: "", type: "Text", content: "" });
      setShowModal(false);
    } catch {
      alert("Failed to save prompt");
    }
    setLoading(false);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditing(prompt.id);
    setForm({ name: prompt.name, type: prompt.type, content: prompt.content });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this prompt?")) return;
    await deleteDoc(doc(db, "promptLibrary", id));
    if (editing === id) setEditing(null);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Prompt Library</h1>
          <Button className="bg-affiliate-purple hover:bg-affiliate-purple/90" onClick={() => { setShowModal(true); setEditing(null); setForm({ name: "", type: "Text", content: "" }); }}>
            Add New Prompt
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.length === 0 && <div className="text-gray-500 col-span-full">No prompts yet.</div>}
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="font-semibold text-lg mb-1">{prompt.name}</div>
              <div className="text-sm text-gray-600 mb-1">Type: {prompt.type}</div>
              <div className="mb-4 text-gray-700 whitespace-pre-line">{prompt.content}</div>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline" onClick={() => handleEdit(prompt)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(prompt.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Add/Edit Prompt */}
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
              <h2 className="text-2xl font-bold mb-6">{editing ? "Edit Prompt" : "Add New Prompt"}</h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block font-medium mb-1">Prompt Name</label>
                  <Input
                    name="name"
                    placeholder="Enter a name for your prompt"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Prompt Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  >
                    {promptTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Prompt Content</label>
                  <textarea
                    name="content"
                    placeholder="Enter your prompt text here..."
                    value={form.content}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {editing ? (loading ? "Saving..." : "Save Changes") : loading ? "Adding..." : "Add Prompt"}
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

export default PromptLibrary;
