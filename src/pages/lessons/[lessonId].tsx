import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LessonRenderer from '../../components/LessonRenderer';
import LessonSidebar from '../../components/LessonSidebar';
import { db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { LessonBlock } from '../../components/LessonBuilder';

const LessonPage: React.FC = () => {
  const router = useRouter();
  const { lessonId } = router.query;
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<LessonBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleLessons, setModuleLessons] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!lessonId || typeof lessonId !== 'string') return;
    setLoading(true);
    setError(null);
    getDoc(doc(db, 'lessons', lessonId))
      .then(async snap => {
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || '');
          setBlocks(data.blocks || []);

          // Fetch module info for this lesson
          // Assume each lesson has a moduleId field
          if (data.moduleId) {
            const moduleSnap = await getDoc(doc(db, 'modules', data.moduleId));
            if (moduleSnap.exists()) {
              setModuleTitle(moduleSnap.data().title || '');
              // Get all lessons in this module
              const lessonIds: string[] = moduleSnap.data().lessons || [];
              const lessonSnaps = await Promise.all(lessonIds.map((lid: string) => getDoc(doc(db, 'lessons', lid))));
              setModuleLessons(
                lessonSnaps.map(lsnap => ({
                  id: lsnap.id,
                  title: lsnap.data()?.title || '',
                }))
              );
            }
          }
        } else {
          setError('Lesson not found.');
        }
      })
      .catch(() => setError('Failed to load lesson.'))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // TODO: Replace with real user progress tracking
  const handleMarkComplete = () => {
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Outline */}
      {moduleLessons.length > 0 && (
        <LessonSidebar moduleTitle={moduleTitle} lessons={moduleLessons} currentLessonId={lessonId as string} />
      )}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          {moduleTitle && (
            <nav className="text-sm text-gray-500 py-4">
              <span className="mr-2">
                <a href="/modules" className="hover:underline">Modules</a> &gt;
              </span>
              <span className="mr-2">
                <a href={`/modules/${moduleLessons.length > 0 ? moduleLessons[0].id : ''}`} className="hover:underline">{moduleTitle}</a> &gt;
              </span>
              <span className="font-semibold text-gray-800">{title}</span>
            </nav>
          )}
          {loading ? (
            <div className="p-8 text-center">Loading lesson...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <LessonRenderer
              title={title}
              blocks={blocks}
              onMarkComplete={handleMarkComplete}
              completed={completed}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
