import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch } from "firebase/firestore";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import LessonTypeSelector, { LessonType } from "../../../components/LessonTypeSelector";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  videoUrl?: string;
  textContent?: string;
  quizQuestions?: string;
  order?: number;
  moduleId: string;
}

const defaultLesson: Omit<Lesson, "id"> = {
  title: "",
  type: "video",
  videoUrl: "",
  textContent: "",
  quizQuestions: "",
  order: 0,
  moduleId: "",
};

const ModuleLessonsPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [form, setForm] = useState<Omit<Lesson, "id">>(defaultLesson);

  // Fetch lessons
  const fetchLessons = async () => {
    if (!moduleId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "lessons"), where("moduleId", "==", moduleId));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (err) {
      setError("Failed to load lessons");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line
  }, [moduleId]);

  // Drag and drop reorder
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(lessons);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    // Update order locally
    setLessons(reordered.map((l, idx) => ({ ...l, order: idx })));
    // Batch update Firestore
    const batch = writeBatch(db);
    reordered.forEach((lesson, idx) => {
      batch.update(doc(db, "lessons", lesson.id), { order: idx });
    });
    await batch.commit();
    fetchLessons();
  };

  // Add or Edit Lesson
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!moduleId) throw new Error("No moduleId");
      const lessonData = { ...form, moduleId };
      if (lessonData.type === "video") {
        delete lessonData.textContent;
        delete lessonData.quizQuestions;
      } else if (lessonData.type === "text") {
        delete lessonData.videoUrl;
        delete lessonData.quizQuestions;
      } else if (lessonData.type === "quiz") {
        delete lessonData.videoUrl;
        delete lessonData.textContent;
      }
      if (editing) {
        await updateDoc(doc(db, "lessons", editing.id), lessonData);
      } else {
        // Set order to the end
        lessonData.order = lessons.length;
        await addDoc(collection(db, "lessons"), lessonData);
      }
      setShowModal(false);
      setEditing(null);
      setForm(defaultLesson);
      fetchLessons();
    } catch (err: any) {
      setError(err?.message ? `Failed to save lesson: ${err.message}` : "Failed to save lesson");
      console.error("Failed to save lesson", err);
    }
    setLoading(false);
  };

  // Delete Lesson
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "lessons", id));
      fetchLessons();
    } catch (err: any) {
      setError(err?.message ? `Failed to delete lesson: ${err.message}` : "Failed to delete lesson");
      console.error("Failed to delete lesson", err);
    }
    setLoading(false);
  };

  // Modal open for add/edit
  const openAdd = () => {
    setEditing(null);
    setForm({ ...defaultLesson, moduleId: moduleId || "" });
    setShowModal(true);
  };
  const openEdit = (lesson: Lesson) => {
    setEditing(lesson);
    setForm({
      title: lesson.title,
      type: lesson.type,
      videoUrl: lesson.videoUrl || "",
      textContent: lesson.textContent || "",
      quizQuestions: lesson.quizQuestions || "",
      order: lesson.order || 0,
      moduleId: lesson.moduleId,
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(defaultLesson);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lessons for Module</h1>
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-semibold"
          onClick={openAdd}
        >
          + Add Lesson
        </button>
      </div>
      {loading ? (
        <div>Loading lessons...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : lessons.length === 0 ? (
        <div className="text-gray-500">No lessons found for this module.</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="lesson-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-1 gap-6">
                {lessons.map((lesson, idx) => (
                  <Draggable draggableId={lesson.id} index={idx} key={lesson.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded shadow p-4 relative flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-2">
                              {lesson.type === "video" && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>}
                              {lesson.type === "text" && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>}
                              {lesson.type === "quiz" && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>}
                            </span>
                            <h2 className="text-lg font-semibold">{lesson.title}</h2>
                          </div>
                          <span className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-1 ml-2 font-semibold uppercase tracking-wide">{lesson.type}</span>
                        </div>
                        {lesson.type === "video" && lesson.videoUrl && (
                          <p className="text-blue-700 mb-2 text-sm">🎬 <span className="break-all">{lesson.videoUrl}</span></p>
                        )}
                        {lesson.type === "text" && lesson.textContent && (
                          <p className="text-gray-800 mb-2 text-base bg-gray-50 rounded p-2 border">{lesson.textContent}</p>
                        )}
                        {lesson.type === "quiz" && lesson.quizQuestions && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-2">
                            <span className="font-semibold text-yellow-900">Quiz:</span>
                            <ul className="list-disc ml-6 text-yellow-900">
                              {lesson.quizQuestions.split(",").map((q, i) => (
                                <li key={i} className="mb-1">{q.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 shadow-sm transition"
                            onClick={() => openEdit(lesson)}
                          >Edit</button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 shadow-sm transition"
                            onClick={() => handleDelete(lesson.id)}
                          >Delete</button>
                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 shadow-sm transition"
                            onClick={() => {
                              localStorage.setItem('lessonPreview', JSON.stringify(lesson));
                              window.open(`/student/lesson-preview`, '_blank', 'noopener,noreferrer');
                            }}
                          >Preview as Student</button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-3xl" onClick={closeModal}>&times;</button>
            <h3 className="text-2xl font-bold mb-6">{editing ? "Edit Lesson" : "Add New Lesson"}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Lesson Type</label>
                <LessonTypeSelector value={form.type} onChange={type => setForm(f => ({ ...f, type }))} />
              </div>
              {form.type === "video" && (
                <div>
                  <label className="block font-semibold mb-1">Video URL</label>
                  <input className="w-full border rounded px-3 py-2" name="videoUrl" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} />
                </div>
              )}
              {form.type === "text" && (
                <div>
                  <label className="block font-semibold mb-1">Text Content</label>
                  <ReactQuill
                    className="bg-white rounded"
                    theme="snow"
                    value={form.textContent || ''}
                    onChange={val => setForm(f => ({ ...f, textContent: val }))}
                    placeholder="Start writing lesson content..."
                    style={{ minHeight: 180 }}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'align': [] }],
                        ['blockquote', 'code-block'],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    formats={[
                      'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
                      'list', 'bullet', 'indent', 'align', 'blockquote', 'code-block', 'link', 'image'
                    ]}
                  />
                </div>
              )}
              {form.type === "quiz" && (
                <div>
                  <label className="block font-semibold mb-1">Quiz Questions (comma separated)</label>
                  <textarea className="w-full border rounded px-3 py-2" name="quizQuestions" value={form.quizQuestions} onChange={e => setForm(f => ({ ...f, quizQuestions: e.target.value }))} />
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={closeModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">{editing ? "Save Changes" : "Create Lesson"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleLessonsPage;
