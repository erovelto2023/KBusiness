import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  lessons: string[]; // array of lesson IDs
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
}

const ModulePage: React.FC = () => {
  const { moduleId } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId || typeof moduleId !== 'string') return;
    setLoading(true);
    setError(null);
    getDoc(doc(db, 'modules', moduleId))
      .then(async snap => {
        if (snap.exists()) {
          const data = snap.data();
          setModule({ id: snap.id, ...data } as Module);
          // Fetch lesson details
          const lessonSnaps = await Promise.all((data.lessons || []).map((lid: string) => getDoc(doc(db, 'lessons', lid))));
          setLessons(
            lessonSnaps.map(lsnap => ({
              id: lsnap.id,
              title: lsnap.data()?.title || '',
              description: lsnap.data()?.description || '',
              coverUrl: lsnap.data()?.coverUrl || '',
            }))
          );
        } else {
          setError('Module not found.');
        }
      })
      .catch(() => setError('Failed to load module.'))
      .finally(() => setLoading(false));
  }, [moduleId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="p-8 text-center">Loading module...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : module ? (
        <div className="max-w-5xl mx-auto p-8">
          {module.bannerUrl && (
            <img src={module.bannerUrl} alt={module.title} className="w-full h-64 object-cover rounded mb-6" />
          )}
          <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
          <p className="mb-8 text-gray-700">{module.description}</p>
          <h2 className="text-xl font-semibold mb-4">Lessons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {lessons.map(lesson => (
              <div key={lesson.id} className="bg-white rounded shadow p-4 flex flex-col">
                {lesson.coverUrl && (
                  <img src={lesson.coverUrl} alt={lesson.title} className="rounded mb-4 object-cover h-32 w-full" />
                )}
                <h3 className="text-lg font-bold mb-1">{lesson.title}</h3>
                <p className="mb-4 text-gray-600">{lesson.description}</p>
                <Link to={`/lessons/${lesson.id}`} className="mt-auto px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 text-center">Access Now</Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ModulePage;
