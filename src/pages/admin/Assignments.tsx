import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AssignmentBuilder from "../../components/AssignmentBuilder";
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

interface Assignment {
  id: string;
  title: string;
  description: string;
  lesson: string | null; // lesson ID
  type: 'essay' | 'quiz' | 'mcq' | 'file' | 'video';
  details: Record<string, any>; // type-specific fields
}

const defaultAssignment: Omit<Assignment, "id"> = {
  title: "",
  description: "",
  lesson: null,
  type: "essay",
  details: {},
};

const AssignmentsAdmin: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [form, setForm] = useState<Omit<Assignment, "id">>(defaultAssignment);

  // Helper: Convert Firestore doc to Assignment
  const docToAssignment = (doc: QueryDocumentSnapshot<DocumentData>): Assignment => ({
    id: doc.id,
    ...doc.data(),
  });

  // Fetch all assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(collection(db, "assignments"));
        setAssignments(snapshot.docs.map(docToAssignment));
      } catch (err: any) {
        setError("Failed to load assignments");
      }
      setLoading(false);
    };
    fetchAssignments();
  }, []);

  // CRUD functions
  const addAssignment = async () => {
    try {
      const docRef = await addDoc(collection(db, "assignments"), {
        ...form,
        createdAt: Date.now(),
      });
      setAssignments((prev) => [...prev, { ...form, id: docRef.id }]);
    } catch (err) {
      setError("Failed to add assignment");
    }
  };

  const editAssignment = async () => {
    if (!editing) return;
    try {
      await updateDoc(doc(db, "assignments", editing.id), form);
      setAssignments((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...form } : a)));
    } catch (err) {
      setError("Failed to update assignment");
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await deleteDoc(doc(db, "assignments", id));
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError("Failed to delete assignment");
    }
  };


  const openAdd = () => {
    setEditing(null);
    setForm(defaultAssignment);
    setShowModal(true);
  };
  const openEdit = (assignment: Assignment) => {
    setEditing(assignment);
    setForm({ ...assignment });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // For AssignmentBuilder
  const handleDetailsChange = (details: Record<string, any>) => {
    setForm((f) => ({ ...f, details }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await editAssignment();
    } else {
      await addAssignment();
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteAssignment(id);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Assignments</h1>
        <button className="mb-6 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={openAdd}>+ Add New Assignment</button>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Lesson</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No assignments yet.</td></tr>
              )}
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="border-t">
                  <td className="p-2 font-semibold">{assignment.title}</td>
                  <td className="p-2">{assignment.description}</td>
                  <td className="p-2">{assignment.lesson}</td>
                  <td className="p-2">
                    <button className="text-blue-700 hover:underline mr-2" onClick={() => openEdit(assignment)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(assignment.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg w-full max-w-lg p-8 relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={closeModal}>&times;</button>
              <h2 className="text-xl font-bold mb-4">{editing ? "Edit Assignment" : "Add Assignment"}</h2>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea className="w-full border rounded px-3 py-2" name="description" value={form.description} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Lesson ID</label>
                  <input className="w-full border rounded px-3 py-2" name="lesson" value={form.lesson || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assignment Type</label>
                  <select className="w-full border rounded px-3 py-2" name="type" value={form.type} onChange={handleChange}>
                    <option value="essay">Essay</option>
                    <option value="quiz">Quiz</option>
                    <option value="mcq">Multiple Choice</option>
                    <option value="file">File Upload</option>
                    <option value="video">Video Submission</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assignment Details</label>
                  <div className="border rounded p-3">
                    {/* AssignmentBuilder renders type-specific fields */}
                    <AssignmentBuilder type={form.type} details={form.details} onChange={handleDetailsChange} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">{editing ? "Save Changes" : "Create Assignment"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignmentsAdmin;
