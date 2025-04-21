import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "./firebase";

const CourseCatalog: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getCourses()
      .then(snapshot => {
        setCourses(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  const filtered = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Course Catalog</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full border rounded px-3 py-2 mb-4"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <div key={course.id} className="bg-gray-100 rounded p-4">
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="mb-2">{course.description || "No description."}</p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={() => navigate(`/lms/course/${course.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-gray-500">No courses found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
