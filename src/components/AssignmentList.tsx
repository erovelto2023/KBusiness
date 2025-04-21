import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AssignmentList = ({ lessonId }) => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!lessonId) return;
    getDocs(collection(db, "assignments")).then(snapshot => {
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(a => a.lessonId === lessonId);
      setAssignments(docs);
    });
  }, [lessonId]);

  return (
    <ul className="ml-4">
      {assignments.map(a => (
        <li key={a.id} className="mb-2 p-2 bg-gray-50 rounded">
          {a.title}
        </li>
      ))}
    </ul>
  );
};

export default AssignmentList;
