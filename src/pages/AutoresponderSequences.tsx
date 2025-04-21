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

interface Sequence {
  id: string;
  program: string;
  name: string;
  content: string;
  createdAt: any;
}

const AutoresponderSequences = () => {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [form, setForm] = useState<Omit<Sequence, "id" | "createdAt">>({ program: "", name: "", content: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Example program options (replace with real data if needed)
  const programOptions = ["Program A", "Program B", "Program C"]; 

  useEffect(() => {
    const qSeq = query(collection(db, "autoresponderSequences"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qSeq, (snap) => {
      setSequences(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sequence)));
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
        await updateDoc(doc(db, "autoresponderSequences", editing), { ...form });
        setEditing(null);
      } else {
        await addDoc(collection(db, "autoresponderSequences"), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      setForm({ program: "", name: "", content: "" });
      setShowModal(false);
    } catch {
      alert("Failed to save sequence");
    }
    setLoading(false);
  };

  const handleEdit = (seq: Sequence) => {
    setEditing(seq.id);
    setForm({ program: seq.program, name: seq.name, content: seq.content });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this sequence?")) return;
    await deleteDoc(doc(db, "autoresponderSequences", id));
    if (editing === id) setEditing(null);
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Autoresponder Sequences</h1>
          <Button className="bg-affiliate-purple hover:bg-affiliate-purple/90" onClick={() => { setShowModal(true); setEditing(null); setForm({ program: "", name: "", content: "" }); }}>
            Add New Autoresponder Sequence
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sequences.length === 0 && <div className="text-gray-500 col-span-full">No sequences yet.</div>}
          {sequences.map((seq) => (
            <div key={seq.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="font-semibold text-lg mb-1">{seq.program}</div>
              <div className="text-sm text-gray-600 mb-1">Sequence Name: {seq.name}</div>
              <div className="mb-4 text-gray-700 whitespace-pre-line">{seq.content}</div>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline" onClick={() => handleEdit(seq)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(seq.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Add/Edit Autoresponder Sequence */}
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
              <h2 className="text-2xl font-bold mb-6">{editing ? "Edit Autoresponder Sequence" : "Add New Autoresponder Sequence"}</h2>
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
                  <label className="block font-medium mb-1">Sequence Name</label>
                  <Input
                    name="name"
                    placeholder="e.g., Welcome Series, Product Launch, Follow-up Sequence"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Sequence Content</label>
                  <textarea
                    name="content"
                    placeholder="Enter each email in your sequence, separated by three dashes (---). Include subject lines with 'Subject:' prefix."
                    value={form.content}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base min-h-[120px]"
                  />
                  <div className="text-xs text-gray-500 mt-1">Enter each email in your sequence, separated by three dashes (---). Include subject lines with "Subject:" prefix.</div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditing(null); }}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {editing ? (loading ? "Saving..." : "Save Changes") : loading ? "Adding..." : "Add Sequence"}
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

export default AutoresponderSequences;
