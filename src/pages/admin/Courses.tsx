import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  image?: string;
  category?: string;
  salesPage?: string;
  status: "draft" | "published";
  updatedAt?: number;
} 

const CoursesAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("updated");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<Omit<Course, "id" | "updatedAt">>({
    title: "",
    description: "",
    instructor: "",
    image: "",
    category: "",
    salesPage: "",
    status: "draft",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Helper: Convert Firestore doc to Course
  const docToCourse = (doc: QueryDocumentSnapshot<DocumentData>): Course => ({
    id: doc.id,
    ...doc.data(),
  } as Course);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        setCourses(snapshot.docs.map(docToCourse));
      } catch (err: any) {
        setError("Failed to load courses");
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Add or Edit Course
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let docRef;
      const courseData = {
        ...form,
        updatedAt: Date.now(),
      };
      if (editing) {
        // Update
        docRef = editing.id;
        await updateDoc(doc(db, "courses", editing.id), courseData);
        setCourses((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...courseData } : c)));
      } else {
        // Add
        docRef = await addDoc(collection(db, "courses"), courseData);
        setCourses((prev) => [...prev, { ...courseData, id: docRef.id }]);
      }
      setShowModal(false);
      setImagePreview(null);
    } catch (err: any) {
      setError(err?.message ? `Failed to save course: ${err.message}` : "Failed to save course");
      console.error("Failed to save course", err);
    }
    setLoading(false);
  };

  // Image upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setForm((f) => ({ ...f, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Modal open for edit
  const openEdit = (course: Course) => {
    setEditing(course);
    setForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor || "",
      image: course.image || "",
      category: course.category || "",
      salesPage: course.salesPage || "",
      status: course.status,
    });
    setImagePreview(course.image || null);
    setShowModal(true);
  };

  // Modal close
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setImagePreview(null);
  };

  // Filter and sort
  let filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (!category || c.category === category)
  );
  if (sort === "updated") {
    filtered = filtered.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } else if (sort === "title") {
    filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold flex-shrink-0">Courses</h1>
            <div className="flex items-center">
              <button
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-semibold"
                style={{ marginTop: 0, marginBottom: 0 }}
                onClick={() => {
                  setEditing(null);
                  setForm({
                    title: "",
                    description: "",
                    instructor: "",
                    image: "",
                    category: "",
                    salesPage: "",
                    status: "draft",
                  });
                  setShowModal(true);
                }}
              >
                + Add Course
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              className="border rounded px-3 py-2"
              placeholder="Search courses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {/* TODO: Category options dynamically from Firestore */}
              <option value="Wellness">Wellness</option>
              <option value="Business">Business</option>
            </select>
            <select
              className="border rounded px-3 py-2"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="updated">Last Updated</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div> 
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(course => (
              <div
                key={course.id}
                className="bg-white rounded shadow p-4 flex flex-col cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                onClick={e => {
                  // Only navigate if not clicking the Edit button
                  if ((e.target as HTMLElement).closest("button")) return;
                  window.location.href = `/admin/courses/${course.id}/modules`;
                }}
              >
                <div className="relative h-40 mb-4 rounded overflow-hidden bg-gray-100">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${course.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">{course.title}</div>
                  <div className="text-sm text-gray-600 mb-2">{course.instructor || "No instructor"}</div>
                  <div className="text-xs text-gray-400">{course.category || "No category"}</div>
                  <div className="text-xs text-gray-400">Updated {course.updatedAt ? new Date(course.updatedAt).toLocaleString() : "-"}</div>
                </div>
                <button
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  onClick={e => {
                    e.stopPropagation();
                    openEdit(course);
                  }}
                >Edit</button>
              </div>
            ))}
          </div> 
        )}
        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl" onClick={closeModal}>&times;</button>
              <h3 className="text-2xl font-bold mb-6">{editing ? "Edit Course" : "Add New Course"}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-1">Title</label>
                  <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Instructor</label>
                  <input className="w-full border rounded px-3 py-2" name="instructor" value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input className="w-full border rounded px-3 py-2" name="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sales Page</label>
                  <input className="w-full border rounded px-3 py-2" name="salesPage" value={form.salesPage} onChange={e => setForm(f => ({ ...f, salesPage: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea className="w-full border rounded px-3 py-2" name="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select className="w-full border rounded px-3 py-2" name="status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "draft" | "published" }))}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Featured Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 rounded w-full h-32 object-cover" />
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">{editing ? "Save Changes" : "Create Course"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursesAdmin;
