import React, { useState } from 'react';
import LessonBuilder, { LessonBlock } from '../../components/LessonBuilder';
import { db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface LessonEditorProps {
  lessonId: string;
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lessonId }) => {
  const [blocks, setBlocks] = useState<LessonBlock[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load lesson on mount
  React.useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'lessons', lessonId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || '');
          setBlocks(data.blocks || []);
        }
      } catch (e: any) {
        setError('Failed to load lesson.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const docRef = doc(db, 'lessons', lessonId);
      await setDoc(docRef, { title, blocks }, { merge: true });
    } catch (e: any) {
      setError('Failed to save lesson.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Lesson Title</label>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <LessonBuilder blocks={blocks} onChange={setBlocks} />
          {error && <div className="text-red-600 mt-2">{error}</div>}
          <button className="mt-6 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Lesson'}
          </button>
        </>
      )}
    </div>
  );
};

export default LessonEditor;
