import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface LMSClass {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  prerequisites: string;
  instructors: string;
  notes: string;
  image?: string; // data URL
  categories: string;
  tags: string;
  visibility: "public" | "private";
  visibleAfter: string;
  archived: boolean;
}

const defaultClass: Omit<LMSClass, "id"> = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  prerequisites: "",
  instructors: "",
  notes: "",
  image: undefined,
  categories: "",
  tags: "",
  visibility: "public",
  visibleAfter: "",
  archived: false,
};

const ClassesAdmin: React.FC = () => {
  const [classes, setClasses] = useState<LMSClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<LMSClass | null>(null);
  const [form, setForm] = useState<Omit<LMSClass, "id">>(defaultClass);

  // Helper: Convert Firestore doc to LMSClass
  const docToClass = (doc: QueryDocumentSnapshot<DocumentData>): LMSClass => ({
    id: doc.id,
    ...doc.data(),
  });

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(collection(db, "classes"));
        setClasses(snapshot.docs.map(docToClass));
      } catch (err: any) {
        setError("Failed to load classes");
      }
      setLoading(false);
    };
    fetchClasses();
  }, []);

  // CRUD functions
  const addClass = async () => {
    try {
      const docRef = await addDoc(collection(db, "classes"), {
        ...form,
        createdAt: Date.now(),
      });
      setClasses((prev) => [...prev, { ...form, id: docRef.id }]);
    } catch (err) {
      setError("Failed to add class");
    }
  };

  const editClass = async () => {
    if (!editing) return;
    try {
      await updateDoc(doc(db, "classes", editing.id), form);
      setClasses((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...form } : c)));
    } catch (err) {
      setError("Failed to update class");
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, "classes", id));
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError("Failed to delete class");
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(defaultClass);
    setShowModal(true);
  };

  const openEdit = (cls: LMSClass) => {
    setEditing(cls);
    setForm({ ...cls });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await editClass();
    } else {
      await addClass();
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteClass(id);
  };

  const handleArchive = (id: string) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, archived: true } : c)));
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Manage Classes</h2>
        <button
          className="mb-6 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          onClick={openAdd}
        >
          + Add New Class
        </button>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Instructors</th>
              <th className="text-left p-2">Start</th>
              <th className="text-left p-2">End</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Tags</th>
              <th className="text-left p-2">Visibility</th>
              <th className="text-left p-2">Image</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 && (
              <tr><td colSpan={9} className="p-4 text-center text-gray-500">No classes yet.</td></tr>
            )}
            {loading ? (
              <tr><td colSpan={9} className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={9} className="p-4 text-center text-red-600">{error}</td></tr>
            ) : (
              classes.filter((c) => !c.archived).map((cls) => (
                <tr key={cls.id} className="border-t">
                  <td className="p-2 font-semibold">{cls.title}</td>
                  <td className="p-2">{cls.instructors}</td>
                  <td className="p-2">{cls.startDate}</td>
                  <td className="p-2">{cls.endDate}</td>
                  <td className="p-2">{cls.categories}</td>
                  <td className="p-2">{cls.tags}</td>
                  <td className="p-2 capitalize">{cls.visibility}</td>
                  <td className="p-2">{cls.image && <img src={cls.image} alt="Class" className="max-h-12 rounded" />}</td>
                  <td className="p-2">
                    <button className="text-blue-700 hover:underline mr-2" onClick={() => openEdit(cls)}>Edit</button>
                    <button className="text-yellow-700 hover:underline mr-2" onClick={() => handleArchive(cls.id)}>Archive</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(cls.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          
                  <button className="text-blue-700 hover:underline mr-2" onClick={() => openEdit(cls)}>Edit</button>
                  <button className="text-yellow-700 hover:underline mr-2" onClick={() => handleArchive(cls.id)}>Archive</button>
          </tbody>
        </table>
        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-10 relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl" onClick={closeModal}>&times;</button>
              <h3 className="text-2xl font-bold mb-6">{editing ? "Edit Class" : "Add New Class"}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input className="w-full border rounded px-3 py-2" name="categories" value={form.categories} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea className="w-full border rounded px-3 py-2" name="description" value={form.description} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input type="date" className="w-full border rounded px-3 py-2" name="startDate" value={form.startDate} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date</label>
                  <input type="date" className="w-full border rounded px-3 py-2" name="endDate" value={form.endDate} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Prerequisites</label>
                  <input className="w-full border rounded px-3 py-2" name="prerequisites" value={form.prerequisites} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Instructors / TAs</label>
                  <input className="w-full border rounded px-3 py-2" name="instructors" value={form.instructors} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Notes</label>
                  <textarea className="w-full border rounded px-3 py-2" name="notes" value={form.notes} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tags (comma separated)</label>
                  <input className="w-full border rounded px-3 py-2" name="tags" value={form.tags} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Class Image</label>
                  <input type="file" accept="image/*" className="w-full" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target?.result as string }));
                      reader.readAsDataURL(file);
                    }
                  }} />
                  {form.image && <img src={form.image} alt="Class" className="mt-2 max-h-24 rounded" />}
                </div>
                <div>
                  <label className="block font-semibold mb-1">Visibility</label>
                  <select className="w-full border rounded px-3 py-2" name="visibility" value={form.visibility} onChange={handleChange}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Visible After</label>
                  <input type="date" className="w-full border rounded px-3 py-2" name="visibleAfter" value={form.visibleAfter} onChange={handleChange} />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">{editing ? "Save Changes" : "Create Class"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Archived Classes */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Archived Classes</h3>
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Instructors</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Tags</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.filter((c) => c.archived).length === 0 && (
                <tr><td colSpan={5} className="p-4 text-center text-gray-400">No archived classes.</td></tr>
              )}
              {classes.filter((c) => c.archived).map((cls) => (
                <tr key={cls.id} className="border-t">
                  <td className="p-2 font-semibold">{cls.title}</td>
                  <td className="p-2">{cls.instructors}</td>
                  <td className="p-2">{cls.categories}</td>
                  <td className="p-2">{cls.tags}</td>
                  <td className="p-2">
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(cls.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ClassesAdmin;
