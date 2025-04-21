import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

interface Module {
  id: string;
  title: string;
  description?: string;
  order?: number;
  courseId: string;
}

const defaultModule: Omit<Module, "id"> = {
  title: "",
  description: "",
  order: 0,
  courseId: "",
};

const CourseModulesPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Module | null>(null);
  const [form, setForm] = useState<Omit<Module, "id">>(defaultModule);

  // Fetch modules
  const fetchModules = async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "modules"), where("courseId", "==", courseId));
      const snap = await getDocs(q);
      setModules(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Module)));
    } catch (err) {
      setError("Failed to load modules");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line
  }, [courseId]);

  // Add or Edit Module
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!courseId) throw new Error("No courseId");
      const moduleData = { ...form, courseId };
      if (editing) {
        await updateDoc(doc(db, "modules", editing.id), moduleData);
      } else {
        await addDoc(collection(db, "modules"), moduleData);
      }
      setShowModal(false);
      setEditing(null);
      setForm(defaultModule);
      fetchModules();
    } catch (err: any) {
      setError(err?.message ? `Failed to save module: ${err.message}` : "Failed to save module");
      console.error("Failed to save module", err);
    }
    setLoading(false);
  };

  // Delete Module
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "modules", id));
      fetchModules();
    } catch (err: any) {
      setError(err?.message ? `Failed to delete module: ${err.message}` : "Failed to delete module");
      console.error("Failed to delete module", err);
    }
    setLoading(false);
  };

  // Modal open for add/edit
  const openAdd = () => {
    setEditing(null);
    setForm({ ...defaultModule, courseId: courseId || "" });
    setShowModal(true);
  };
  const openEdit = (module: Module) => {
    setEditing(module);
    setForm({
      title: module.title,
      description: module.description || "",
      order: module.order || 0,
      courseId: module.courseId,
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(defaultModule);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modules for Course</h1>
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-semibold"
          onClick={openAdd}
        >
          + Add Module
        </button>
      </div>
      {loading ? (
        <div>Loading modules...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : modules.length === 0 ? (
        <div className="text-gray-500">No modules found for this course.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded shadow p-4 relative">
              <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
              <p className="text-gray-600 mb-2">{module.description}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  onClick={() => openEdit(module)}
                >Edit</button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  onClick={() => handleDelete(module.id)}
                >Delete</button>
                <Link to={`/admin/modules/${module.id}`} className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl" onClick={closeModal}>&times;</button>
            <h3 className="text-2xl font-bold mb-6">{editing ? "Edit Module" : "Add New Module"}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2" name="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="block font-semibold mb-1">Order</label>
                <input type="number" className="w-full border rounded px-3 py-2" name="order" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">{editing ? "Save Changes" : "Create Module"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseModulesPage;
