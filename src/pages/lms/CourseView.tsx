import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourses, getLessons, getAssignments } from "./firebase";

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getCourses(),
      getLessons(courseId),
      getAssignments(courseId)
    ])
      .then(([coursesSnap, lessonsSnap, assignmentsSnap]) => {
        const courseDoc = coursesSnap.docs.find((doc: any) => doc.id === courseId);
        setCourse(courseDoc ? { id: courseDoc.id, ...courseDoc.data() } : null);
        setLessons(lessonsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        setAssignments(assignmentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load course data");
        setLoading(false);
      });
  }, [courseId]);

  if (!courseId) {
    return <div className="text-red-600">No course selected.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !course ? (
        <div className="text-gray-600">Course not found.</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">{course.title}</h2>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <p className="mb-4">{course.description || "No description."}</p>
            <h3 className="font-semibold text-lg mb-4">Lessons</h3>
            <ul className="list-disc pl-6 space-y-2">
              {lessons.map(lesson => (
                <li key={lesson.id}>{lesson.title}</li>
              ))}
              {lessons.length === 0 && <li className="text-gray-500">No lessons yet.</li>}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Assignments & Quizzes</h3>
            <ul className="list-disc pl-6 space-y-2">
              {assignments.map(assignment => (
                <li key={assignment.id}>{assignment.title} ({assignment.type})</li>
              ))}
              {assignments.length === 0 && <li className="text-gray-500">No assignments yet.</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseView;
