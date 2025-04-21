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

interface Lesson {
  id: string;
  title: string;
  description: string;
  contentType: "video" | "quiz" | "assignment" | "other";
  classes: number[]; // class IDs
}

const defaultLesson: Omit<Lesson, "id" | "classes"> = {
  title: "",
  description: "",
  contentType: "other",
};

const LessonsAdmin: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [form, setForm] = useState<Omit<Lesson, "id" | "classes">>(defaultLesson);

  // Helper: Convert Firestore doc to Lesson
  const docToLesson = (doc: QueryDocumentSnapshot<DocumentData>): Lesson => ({
    id: doc.id,
    ...doc.data(),
    classes: doc.data().classes || [],
  });

  // Fetch all lessons
  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(collection(db, "lessons"));
        setLessons(snapshot.docs.map(docToLesson));
      } catch (err: any) {
        setError("Failed to load lessons");
      }
      setLoading(false);
    };
    fetchLessons();
  }, []);

  // CRUD functions
  const addLesson = async () => {
    try {
      const docRef = await addDoc(collection(db, "lessons"), {
        ...form,
        classes: [],
        createdAt: Date.now(),
      });
      setLessons((prev) => [...prev, { ...form, id: docRef.id, classes: [] }]);
    } catch (err) {
      setError("Failed to add lesson");
    }
  };

  const editLesson = async () => {
    if (!editing) return;
    try {
      await updateDoc(doc(db, "lessons", editing.id), form);
      setLessons((prev) => prev.map((l) => (l.id === editing.id ? { ...l, ...form } : l)));
    } catch (err) {
      setError("Failed to update lesson");
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      await deleteDoc(doc(db, "lessons", id));
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError("Failed to delete lesson");
    }
  };


  const openAdd = () => {
    setEditing(null);
    setForm(defaultLesson);
    setShowModal(true);
  };
  const openEdit = (lesson: Lesson) => {
    setEditing(lesson);
    setForm({ title: lesson.title, description: lesson.description, contentType: lesson.contentType });
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
      await editLesson();
    } else {
      await addLesson();
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteLesson(id);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Lessons</h1>
        <button className="mb-6 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={openAdd}>+ Add New Lesson</button>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Assigned Classes</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No lessons yet.</td></tr>
              )}
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="border-t">
                  <td className="p-2 font-semibold">{lesson.title}</td>
                  <td className="p-2 capitalize">{lesson.contentType}</td>
                  <td className="p-2">{lesson.classes.length}</td>
                  <td className="p-2">
                    <button className="text-blue-700 hover:underline mr-2" onClick={() => openEdit(lesson)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(lesson.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-10 relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl" onClick={closeModal}>&times;</button>
              <h3 className="text-2xl font-bold mb-6">{editing ? "Edit Lesson" : "Add New Lesson"}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select className="w-full border rounded px-3 py-2" name="contentType" value={form.contentType} onChange={handleChange}>
                    <option value="video">Video</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea className="w-full border rounded px-3 py-2" name="description" value={form.description} onChange={handleChange} />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">{editing ? "Save Changes" : "Create Lesson"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonsAdmin;
