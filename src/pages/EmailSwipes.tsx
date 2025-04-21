import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";

interface EmailSwipe {
  id: string;
  programId: string;
  subject: string;
  content: string;
}

const EmailSwipes = () => {
  const { toast } = useToast();
  const [swipes, setSwipes] = useState<EmailSwipe[]>([]);
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ programId: string; subject: string; content: string }>({
    programId: "",
    subject: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch all programs for dropdown
  useEffect(() => {
    const q = query(collection(db, "programs"), orderBy("name"));
    return onSnapshot(q, snap => {
      setPrograms(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    });
  }, []);

  // Fetch all swipes
  useEffect(() => {
    const q = query(collection(db, "emailSwipes"), orderBy("subject"));
    return onSnapshot(q, snap => {
      setSwipes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailSwipe)));
    });
  }, []);

  const filteredSwipes = swipes.filter(
    s =>
      (!search ||
        s.subject.toLowerCase().includes(search.toLowerCase()) ||
        s.content.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddSwipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "emailSwipes"), form);
      toast({ title: "Email Swipe Added", description: "Your swipe has been saved." });
      setShowModal(false);
      setForm({ programId: "", subject: "", content: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Promotional Tools</h1>
        <div className="flex gap-6 mb-8">
          <div className="flex flex-col gap-2 w-48">
            <Button variant="ghost" className="justify-start font-semibold text-affiliate-purple">Email Swipes</Button>
            <Button variant="ghost" className="justify-start">Banners</Button>
            <Button variant="ghost" className="justify-start">Product Reviews</Button>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-xs">
                <Input
                  placeholder="Search email swipes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-affiliate-purple hover:bg-affiliate-purple/90" onClick={() => setShowModal(true)}>
                Add New Swipe
              </Button>
            </div>
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSwipes.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-500">No email swipes found.</td>
                    </tr>
                  ) : (
                    filteredSwipes.map(swipe => (
                      <tr key={swipe.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {programs.find(p => p.id === swipe.programId)?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{swipe.subject}</td>
                        <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-500 max-w-lg truncate">{swipe.content}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded-lg max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-xl font-semibold mb-4">Add New Email Swipe</h2>
              <form onSubmit={handleAddSwipe} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Program</label>
                  <Select
                    value={form.programId}
                    onValueChange={val => setForm(f => ({ ...f, programId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Line</label>
                  <Input
                    type="text"
                    placeholder="Subject line"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Content</label>
                  <textarea
                    className="w-full border rounded p-2 min-h-[120px]"
                    placeholder="Write your email content here..."
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-affiliate-purple hover:bg-affiliate-purple/90" disabled={loading}>
                    Add Swipe
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

export default EmailSwipes;
