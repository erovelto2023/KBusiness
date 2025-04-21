
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { AffiliateLink } from "../types";
import { Search, Plus, Link2, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

const Links = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<AffiliateLink, "id">>({ programName: "", link: "", notes: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "links"), orderBy("programName"));
    const unsub = onSnapshot(q, (snap) => {
      setLinks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AffiliateLink)));
    });
    return () => unsub();
  }, []);

  const filteredLinks = links.filter(link => 
    link.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.link.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.notes && link.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openAddModal = () => {
    setEditId(null);
    setForm({ programName: "", link: "", notes: "" });
    setShowModal(true);
  };

  const openEditModal = (id: string) => {
    const l = links.find(l => l.id === id);
    if (!l) return;
    setEditId(id);
    setForm({ programName: l.programName, link: l.link, notes: l.notes || "" });
    setShowModal(true);
  };

  const handleDeleteLink = async (id: string) => {
    await deleteDoc(doc(db, "links", id));
    toast({ title: "Link Deleted", description: "Link removed successfully", variant: "destructive" });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "links", editId), form);
        toast({ title: "Link Updated", description: "Link updated successfully" });
      } else {
        await addDoc(collection(db, "links"), form);
        toast({ title: "Link Added", description: "New link added successfully" });
      }
      setShowModal(false);
      setForm({ programName: "", link: "", notes: "" });
      setEditId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link Copied",
        description: "Affiliate link copied to clipboard",
      });
    });
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Affiliate Links</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button 
              className="flex items-center gap-2 bg-affiliate-purple hover:bg-affiliate-purple/90"
              onClick={openAddModal}
            >
              <Plus className="h-4 w-4" />
              <span>Add Link</span>
            </Button>
          </div>
        </div>

        {/* Add/Edit Link Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>&times;</button>
              <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Link" : "Add Link"}</h2>
              <form onSubmit={handleModalSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Program Name"
                  value={form.programName}
                  onChange={e => setForm({ ...form, programName: e.target.value })}
                  required
                />
                <input
                  type="url"
                  placeholder="Affiliate Link"
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-affiliate-purple text-white py-2 rounded hover:bg-affiliate-purple/90"
                >
                  {editId ? "Update Link" : "Add Link"}
                </button>
              </form>
            </div>
          </div>
        )}

        
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{link.programName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <code className="text-sm text-gray-600 mr-2 max-w-xs truncate">
                          {link.link}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleCopyLink(link.link)}
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {link.notes || "No notes"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => openEditModal(link.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => handleVisitLink(link.link)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLinks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No links found matching your search.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={openAddModal}
              >
                Add your first link
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Links;
