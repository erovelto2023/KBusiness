import React, { useState } from 'react';

interface AssignmentBuilderProps {
  type: 'essay' | 'quiz' | 'mcq' | 'file' | 'video';
  details: Record<string, any>;
  onChange: (details: Record<string, any>) => void;
}

const AssignmentBuilder: React.FC<AssignmentBuilderProps> = ({ type, details, onChange }) => {
  // Render fields based on assignment type
  switch (type) {
    case 'essay':
      return (
        <>
          <label className="block font-semibold mb-1">Prompt</label>
          <textarea className="w-full border rounded px-3 py-2 mb-2" value={details.prompt || ''} onChange={e => onChange({ ...details, prompt: e.target.value })} />
          <label className="block font-semibold mb-1">Word Limit</label>
          <input type="number" className="w-full border rounded px-3 py-2 mb-2" value={details.wordLimit || ''} onChange={e => onChange({ ...details, wordLimit: e.target.value })} />
          <label className="block font-semibold mb-1">Rubric/Instructions</label>
          <textarea className="w-full border rounded px-3 py-2" value={details.rubric || ''} onChange={e => onChange({ ...details, rubric: e.target.value })} />
        </>
      );
    case 'quiz':
      return (
        <QuizBuilder details={details} onChange={onChange} />
      );
    case 'mcq':
      return (
        <>
          <label className="block font-semibold mb-1">Question</label>
          <textarea className="w-full border rounded px-3 py-2 mb-2" value={details.question || ''} onChange={e => onChange({ ...details, question: e.target.value })} />
          <label className="block font-semibold mb-1">Options</label>
          <OptionsInput options={details.options || []} onChange={opts => onChange({ ...details, options: opts })} />
          <label className="block font-semibold mb-1">Correct Option</label>
          <input className="w-full border rounded px-3 py-2 mb-2" value={details.correctOption || ''} onChange={e => onChange({ ...details, correctOption: e.target.value })} />
          <label className="block font-semibold mb-1">Points</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={details.points || ''} onChange={e => onChange({ ...details, points: e.target.value })} />
        </>
      );
    case 'file':
      return (
        <>
          <label className="block font-semibold mb-1">Instructions</label>
          <textarea className="w-full border rounded px-3 py-2 mb-2" value={details.instructions || ''} onChange={e => onChange({ ...details, instructions: e.target.value })} />
          <label className="block font-semibold mb-1">Allowed File Types (comma separated)</label>
          <input className="w-full border rounded px-3 py-2 mb-2" value={details.allowedTypes || ''} onChange={e => onChange({ ...details, allowedTypes: e.target.value })} />
          <label className="block font-semibold mb-1">Max File Size (MB)</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={details.maxSize || ''} onChange={e => onChange({ ...details, maxSize: e.target.value })} />
        </>
      );
    case 'video':
      return (
        <>
          <label className="block font-semibold mb-1">Instructions</label>
          <textarea className="w-full border rounded px-3 py-2 mb-2" value={details.instructions || ''} onChange={e => onChange({ ...details, instructions: e.target.value })} />
          <label className="block font-semibold mb-1">Max Video Length (minutes)</label>
          <input type="number" className="w-full border rounded px-3 py-2 mb-2" value={details.maxLength || ''} onChange={e => onChange({ ...details, maxLength: e.target.value })} />
          <label className="block font-semibold mb-1">Allowed Formats (comma separated)</label>
          <input className="w-full border rounded px-3 py-2" value={details.allowedFormats || ''} onChange={e => onChange({ ...details, allowedFormats: e.target.value })} />
        </>
      );
    default:
      return null;
  }
};

// Helper for MCQ options
const OptionsInput: React.FC<{ options: string[]; onChange: (opts: string[]) => void }> = ({ options, onChange }) => {
  const [value, setValue] = useState('');
  return (
    <div className="mb-2">
      <div className="flex gap-2 mb-1">
        <input className="flex-1 border rounded px-3 py-2" value={value} onChange={e => setValue(e.target.value)} placeholder="Add option..." />
        <button type="button" className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => { if (value) { onChange([...options, value]); setValue(''); } }}>Add</button>
      </div>
      <ul className="list-disc ml-6">
        {options.map((opt, idx) => (
          <li key={idx} className="flex items-center gap-2">{opt} <button type="button" className="text-red-600" onClick={() => onChange(options.filter((_, i) => i !== idx))}>Remove</button></li>
        ))}
      </ul>
    </div>
  );
};

// QuizBuilder for quizzes (list of questions)
const QuizBuilder: React.FC<{ details: Record<string, any>; onChange: (details: Record<string, any>) => void }> = ({ details, onChange }) => {
  const questions = details.questions || [];
  const addQuestion = () => onChange({ ...details, questions: [...questions, { question: '', type: 'mcq', options: [], correct: '', points: 1 }] });
  const updateQuestion = (idx: number, q: any) => onChange({ ...details, questions: questions.map((item: any, i: number) => i === idx ? q : item) });
  const removeQuestion = (idx: number) => onChange({ ...details, questions: questions.filter((_: any, i: number) => i !== idx) });
  return (
    <div>
      <button type="button" className="mb-2 px-3 py-1 bg-blue-600 text-white rounded" onClick={addQuestion}>Add Question</button>
      {questions.map((q: any, idx: number) => (
        <div key={idx} className="border rounded p-3 mb-2">
          <label className="block font-semibold mb-1">Question</label>
          <input className="w-full border rounded px-3 py-2 mb-2" value={q.question} onChange={e => updateQuestion(idx, { ...q, question: e.target.value })} />
          <label className="block font-semibold mb-1">Type</label>
          <select className="w-full border rounded px-3 py-2 mb-2" value={q.type} onChange={e => updateQuestion(idx, { ...q, type: e.target.value })}>
            <option value="mcq">Multiple Choice</option>
            <option value="short">Short Answer</option>
          </select>
          {q.type === 'mcq' && (
            <>
              <label className="block font-semibold mb-1">Options</label>
              <OptionsInput options={q.options || []} onChange={opts => updateQuestion(idx, { ...q, options: opts })} />
              <label className="block font-semibold mb-1">Correct Option</label>
              <input className="w-full border rounded px-3 py-2 mb-2" value={q.correct || ''} onChange={e => updateQuestion(idx, { ...q, correct: e.target.value })} />
            </>
          )}
          <label className="block font-semibold mb-1">Points</label>
          <input type="number" className="w-full border rounded px-3 py-2 mb-2" value={q.points || 1} onChange={e => updateQuestion(idx, { ...q, points: e.target.value })} />
          <button type="button" className="text-red-600 mt-2" onClick={() => removeQuestion(idx)}>Remove Question</button>
        </div>
      ))}
    </div>
  );
};

export default AssignmentBuilder;
