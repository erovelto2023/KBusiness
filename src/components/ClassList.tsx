import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import LessonList from "./LessonList";

const ClassList = ({ courseId }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (!courseId) return;
    getDocs(collection(db, "classes")).then(snapshot => {
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(cls => cls.courseId === courseId);
      setClasses(docs);
    });
  }, [courseId]);

  return (
    <ul className="ml-4">
      {classes.map(cls => (
        <li key={cls.id} className="mb-2 p-2 bg-gray-50 rounded">
          {cls.title}
          <LessonList classId={cls.id} />
        </li>
      ))}
    </ul>
  );
};

export default ClassList;
