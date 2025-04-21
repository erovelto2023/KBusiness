import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { db } from "../../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

// Type definitions
export type QuizQuestionType =
  | "multiple_choice"
  | "checkbox"
  | "true_false"
  | "fill_blank"
  | "matching"
  | "short_answer"
  | "essay"
  | "numerical"
  | "drag_drop"
  | "hotspot"
  | "ordering"
  | "matrix";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: any[];
  answer: string | any[];
}

export interface QuizSection {
  id: string;
  title: string;
  questions: QuizQuestion[];
  description?: string;
}

export interface QuizSettings {
  randomizeQuestions?: boolean;
  randomizeSections?: boolean;
  timeLimit?: number;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  sections: QuizSection[];
  settings: QuizSettings;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_SETTINGS: QuizSettings = {
  randomizeQuestions: false,
  randomizeSections: false,
  timeLimit: 0,
};

// Helper to deeply remove undefined fields
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = removeUndefined(value);
      }
      return acc;
    }, {} as any);
  }
  return obj;
}

function QuizBuilder() {
  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    sections: [],
    settings: { ...DEFAULT_SETTINGS },
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Section Management
  const addSection = () => {
    const id = uuidv4();
    setQuiz((q) => ({
      ...q,
      sections: [
        ...q.sections,
        { id, title: `Section ${q.sections.length + 1}`, questions: [] },
      ],
    }));
    setActiveSection(id);
  };

  const removeSection = (id: string) => {
    setQuiz((q) => ({
      ...q,
      sections: q.sections.filter((s) => s.id !== id),
    }));
    setActiveSection(null);
  };

  const updateSectionTitle = (id: string, title: string) => {
    setQuiz((q) => ({
      ...q,
      sections: q.sections.map((s) => (s.id === id ? { ...s, title } : s)),
    }));
  };

  // Question Management
  const addQuestion = (sectionId: string, type: QuizQuestionType) => {
    setQuiz((q) => ({
      ...q,
      sections: q.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: [
                ...s.questions,
                {
                  id: uuidv4(),
                  type,
                  question: "",
                  options: type === "multiple_choice" || type === "checkbox" ? ["", ""] : undefined,
                  answer: type === "checkbox" ? [] : "",
                },
              ],
            }
          : s
      ),
    }));
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setQuiz((q) => ({
      ...q,
      sections: q.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.filter((q) => q.id !== questionId),
            }
          : s
      ),
    }));
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<QuizQuestion>
  ) => {
    setQuiz((q) => ({
      ...q,
      sections: q.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : s
      ),
    }));
  };

  // Drag-and-Drop
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // Section drag
    if (result.type === "section") {
      const sections = Array.from(quiz.sections);
      const [removed] = sections.splice(result.source.index, 1);
      sections.splice(result.destination.index, 0, removed);
      setQuiz((q) => ({ ...q, sections }));
      return;
    }
    // Question drag
    const sourceSectionIdx = quiz.sections.findIndex(
      (s) => s.id === result.source.droppableId
    );
    const destSectionIdx = quiz.sections.findIndex(
      (s) => s.id === result.destination!.droppableId
    );
    if (sourceSectionIdx === -1 || destSectionIdx === -1) return;
    const sourceSection = quiz.sections[sourceSectionIdx];
    const destSection = quiz.sections[destSectionIdx];
    const [removed] = sourceSection.questions.splice(result.source.index, 1);
    if (sourceSection === destSection) {
      destSection.questions.splice(result.destination.index, 0, removed);
    } else {
      destSection.questions.splice(result.destination.index, 0, removed);
    }
    const newSections = Array.from(quiz.sections);
    newSections[sourceSectionIdx] = { ...sourceSection };
    newSections[destSectionIdx] = { ...destSection };
    setQuiz((q) => ({ ...q, sections: newSections }));
  };

  // Save to Firestore
  const saveQuiz = async () => {
    setSaving(true);
    try {
      const sanitizedQuiz = removeUndefined(quiz);
      if (quiz.id) {
        await updateDoc(doc(db, "quizzes", quiz.id), sanitizedQuiz);
      } else {
        await addDoc(collection(db, "quizzes"), sanitizedQuiz);
      }
      alert("Quiz saved!");
    } catch (err) {
      alert("Error saving quiz: " + err);
    }
    setSaving(false);
  };

  // UI (minimal placeholder)
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Quiz Builder</h1>
      {/* UI implementation goes here */}
    </div>
  );
}

export default QuizBuilder;
