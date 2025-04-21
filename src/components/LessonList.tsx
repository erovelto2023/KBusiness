import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AssignmentList from "./AssignmentList";

const LessonList = ({ classId }) => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (!classId) return;
    getDocs(collection(db, "lessons")).then(snapshot => {
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(lesson => lesson.classId === classId);
      setLessons(docs);
    });
  }, [classId]);

  return (
    <ul className="ml-4">
      {lessons.map(lesson => (
        <li key={lesson.id} className="mb-2 p-2 bg-gray-50 rounded">
          {lesson.title}
          <AssignmentList lessonId={lesson.id} />
        </li>
      ))}
    </ul>
  );
};

export default LessonList;
