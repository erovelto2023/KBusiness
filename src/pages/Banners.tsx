import React, { useEffect, useState, useRef } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface Banner {
  id: string;
  name: string;
  htmlCode?: string;
  createdAt: any;
}

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [name, setName] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const qBanners = query(collection(db, "banners"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qBanners, (snap) => {
      setBanners(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Banner))
      );
    });
    return () => unsub();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !htmlCode) return;
    setUploading(true);
    try {
      await addDoc(collection(db, "banners"), {
        name,
        htmlCode,
        createdAt: serverTimestamp(),
      });
      setName("");
      setHtmlCode("");
      setShowUpload(false);
    } catch (err) {
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleDelete = async (banner: Banner) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      // Delete from storage
      const filePath = banner.imageUrl.split("/o/")[1]?.split("?")[0];
      if (filePath) {
        const decodedPath = decodeURIComponent(filePath);
        const fileRef = ref(storage, decodedPath);
        await deleteObject(fileRef).catch(() => {}); // ignore if not found
      }
      // Delete from Firestore
      await deleteDoc(doc(db, "banners", banner.id));
    } catch (err) {
      alert("Failed to delete banner.");
    }
  };

  const [search, setSearch] = useState("");
  const filteredBanners = banners.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Banners</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your promotional banners</p>
          </div>
          <Button className="bg-affiliate-purple hover:bg-affiliate-purple/90" onClick={() => setShowUpload(true)}>
            Add New Banner
          </Button>
        </div>
        <div className="mb-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
            </span>
            <Input
              type="text"
              placeholder="Search banners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {filteredBanners.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center text-center">
            <div className="text-gray-500 text-lg font-medium mb-2">No banners added yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <div className="font-semibold mb-2">{banner.name}</div>
                {banner.htmlCode && (
                  <>
                    <div className="w-full bg-gray-50 border rounded p-2 mb-2 text-xs text-gray-700 relative flex items-center">
                      <div className="truncate pr-8 flex-1">{banner.htmlCode}</div>
                      <button
                        className="ml-2 text-xs text-blue-600 hover:underline"
                        style={{fontSize: '11px'}}
                        onClick={() => {navigator.clipboard.writeText(banner.htmlCode || "");}}
                        title="Copy HTML"
                        type="button"
                      >Copy</button>
                      <button
                        className="ml-2 text-xs text-red-600 hover:underline"
                        style={{fontSize: '11px'}}
                        onClick={async () => {
                          if (window.confirm('Delete this banner?')) {
                            await deleteDoc(doc(db, 'banners', banner.id));
                          }
                        }}
                        title="Delete Banner"
                        type="button"
                      >Delete</button>
                    </div>
                    <div className="w-full bg-white border rounded p-2 mb-2 min-h-[40px] flex items-center justify-center">
                      <div dangerouslySetInnerHTML={{ __html: banner.htmlCode }} className="w-full text-center" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setShowUpload(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Add New Banner</h2>
              <form className="flex flex-col gap-4" onSubmit={handleUpload}>
                <Input
                  type="text"
                  placeholder="Banner name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Banner HTML code"
                  value={htmlCode}
                  onChange={e => setHtmlCode(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base min-h-[80px]"
                  required
                />
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Saving..." : "Add Banner"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;
