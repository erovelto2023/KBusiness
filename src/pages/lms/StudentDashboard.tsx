import React, { useEffect, useState } from "react";
import { getCourses, getAssignments } from "./firebase";

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCourses(),
      getAssignments()
    ])
      .then(([coursesSnap, assignmentsSnap]) => {
        setCourses(coursesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        setAssignments(assignmentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  const getProgress = () =>
    courses.map(course => ({
      courseId: course.id,
      title: course.title,
      percent: Math.floor(Math.random() * 100)
    }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome to Your Learning Dashboard</h2>
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">My Courses</h3>
            <ul className="list-disc pl-6 space-y-1">
              {courses.map(course => (
                <li key={course.id}>{course.title}</li>
              ))}
              {courses.length === 0 && <li className="text-gray-500">No courses enrolled.</li>}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Progress</h3>
            <ul className="list-disc pl-6 space-y-1">
              {getProgress().map(progress => (
                <li key={progress.courseId}>
                  {progress.title}: {progress.percent}% complete
                </li>
              ))}
              {courses.length === 0 && <li className="text-gray-500">No progress yet.</li>}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Assignments</h3>
            <ul className="list-disc pl-6 space-y-1">
              {assignments.map(a => (
                <li key={a.id}>{a.title} (Due: {a.dueDate ? new Date(a.dueDate.seconds * 1000).toLocaleDateString() : "N/A"})</li>
              ))}
              {assignments.length === 0 && <li className="text-gray-500">No assignments due.</li>}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Announcements</h3>
            <p>Stay updated with course news and announcements.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
