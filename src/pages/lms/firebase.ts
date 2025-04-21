// Minimal Firebase utility for LMS integration
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase";

export const getCourses = () => getDocs(query(collection(db, "courses"), orderBy("createdAt", "desc")));
// All IDs are strings (Firestore doc IDs)

export const getLessons = (courseId?: string) => {
  const lessonsRef = collection(db, "lessons");
  return courseId
    ? getDocs(query(lessonsRef, where("courseId", "==", courseId), orderBy("createdAt", "desc")))
    : getDocs(query(lessonsRef, orderBy("createdAt", "desc")));
}; // All IDs are strings

export const getAssignments = (courseId?: string) => {
  const assignmentsRef = collection(db, "assignments");
  let q = query(assignmentsRef, orderBy("createdAt", "desc"));
  if (courseId) q = query(assignmentsRef, where("courseId", "==", courseId), orderBy("createdAt", "desc"));
  return getDocs(q);
}; // All IDs are strings
