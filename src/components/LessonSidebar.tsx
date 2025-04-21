import React from 'react';
import { Link } from 'react-router-dom';

interface LessonSidebarProps {
  moduleTitle: string;
  lessons: { id: string; title: string }[];
  currentLessonId: string;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ moduleTitle, lessons, currentLessonId }) => {
  return (
    <aside className="w-64 bg-white border-r p-4 h-full sticky top-0">
      <h3 className="text-lg font-bold mb-4">{moduleTitle}</h3>
      <ul className="space-y-2">
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <Link to={`/lessons/${lesson.id}`} className={`block px-3 py-2 rounded ${lesson.id === currentLessonId ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}>{lesson.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LessonSidebar;
