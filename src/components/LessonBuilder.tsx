import React, { useState } from 'react';

export type LessonBlockType = 'video' | 'content' | 'checklist' | 'accordion' | 'audio' | 'download' | 'pdf';

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  config: Record<string, any>;
}

interface LessonBuilderProps {
  blocks: LessonBlock[];
  onChange: (blocks: LessonBlock[]) => void;
}

const blockTypeLabels: Record<LessonBlockType, string> = {
  video: 'Video',
  content: 'Content',
  checklist: 'Checklist',
  accordion: 'Accordion',
  audio: 'Audio',
  download: 'Download',
  pdf: 'PDF Section',
};

const LessonBuilder: React.FC<LessonBuilderProps> = ({ blocks, onChange }) => {
  const [selectedType, setSelectedType] = useState<LessonBlockType>('video');

  const addBlock = () => {
    const id = Math.random().toString(36).substr(2, 9);
    onChange([...blocks, { id, type: selectedType, config: {} }]);
  };

  const updateBlock = (idx: number, config: Record<string, any>) => {
    const newBlocks = [...blocks];
    newBlocks[idx] = { ...newBlocks[idx], config };
    onChange(newBlocks);
  };

  const removeBlock = (idx: number) => {
    onChange(blocks.filter((_, i) => i !== idx));
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(idx, 1);
    newBlocks.splice(idx + dir, 0, removed);
    onChange(newBlocks);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {Object.entries(blockTypeLabels).map(([type, label]) => (
          <button
            key={type}
            className={`px-3 py-2 rounded ${selectedType === type ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedType(type as LessonBlockType)}
            type="button"
          >
            {label}
          </button>
        ))}
        <button className="px-3 py-2 rounded bg-green-600 text-white" type="button" onClick={addBlock}>+ Add Block</button>
      </div>
      <div>
        {blocks.length === 0 && <div className="text-gray-500">No lesson blocks yet.</div>}
        {blocks.map((block, idx) => (
          <div key={block.id} className="border rounded mb-4 p-4 bg-white shadow">
            <div className="flex justify-between items-center mb-2">
              <strong>{blockTypeLabels[block.type]}</strong>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-gray-700">↑</button>
                <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} className="text-gray-400 hover:text-gray-700">↓</button>
                <button type="button" onClick={() => removeBlock(idx)} className="text-red-600">Remove</button>
              </div>
            </div>
            <LessonBlockEditor block={block} onChange={cfg => updateBlock(idx, cfg)} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual block editors
const LessonBlockEditor: React.FC<{ block: LessonBlock; onChange: (config: Record<string, any>) => void }> = ({ block, onChange }) => {
  switch (block.type) {
    case 'video':
      return (
        <div>
          <label className="block font-semibold mb-1">Video URL</label>
          <input className="w-full border rounded px-3 py-2" value={block.config.url || ''} onChange={e => onChange({ ...block.config, url: e.target.value })} />
        </div>
      );
    case 'content':
      return (
        <div>
          <label className="block font-semibold mb-1">Content</label>
          <textarea className="w-full border rounded px-3 py-2" value={block.config.text || ''} onChange={e => onChange({ ...block.config, text: e.target.value })} />
        </div>
      );
    case 'checklist':
      return <ChecklistBlockEditor config={block.config} onChange={onChange} />;
    case 'accordion':
      return <AccordionBlockEditor config={block.config} onChange={onChange} />;
    case 'audio':
      return (
        <div>
          <label className="block font-semibold mb-1">Audio URL</label>
          <input className="w-full border rounded px-3 py-2" value={block.config.url || ''} onChange={e => onChange({ ...block.config, url: e.target.value })} />
        </div>
      );
    case 'download':
      return (
        <div>
          <label className="block font-semibold mb-1">File URL</label>
          <input className="w-full border rounded px-3 py-2" value={block.config.url || ''} onChange={e => onChange({ ...block.config, url: e.target.value })} />
          <label className="block font-semibold mb-1 mt-2">Label</label>
          <input className="w-full border rounded px-3 py-2" value={block.config.label || ''} onChange={e => onChange({ ...block.config, label: e.target.value })} />
        </div>
      );
    case 'pdf':
      return (
        <div>
          <label className="block font-semibold mb-1">PDF URL</label>
          <input className="w-full border rounded px-3 py-2" value={block.config.url || ''} onChange={e => onChange({ ...block.config, url: e.target.value })} />
          <label className="block font-semibold mb-1 mt-2">Section Title</label>
          <input className="w-full border rounded px-3 py-2" value={block.config.title || ''} onChange={e => onChange({ ...block.config, title: e.target.value })} />
        </div>
      );
    default:
      return null;
  }
};

// Checklist editor
const ChecklistBlockEditor: React.FC<{ config: Record<string, any>; onChange: (cfg: Record<string, any>) => void }> = ({ config, onChange }) => {
  const items: string[] = config.items || [];
  const [value, setValue] = useState('');
  return (
    <div>
      <label className="block font-semibold mb-1">Checklist Items</label>
      <div className="flex gap-2 mb-2">
        <input className="flex-1 border rounded px-3 py-2" value={value} onChange={e => setValue(e.target.value)} placeholder="Add item..." />
        <button type="button" className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => { if (value) { onChange({ ...config, items: [...items, value] }); setValue(''); } }}>Add</button>
      </div>
      <ul className="list-disc ml-6">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">{item} <button type="button" className="text-red-600" onClick={() => onChange({ ...config, items: items.filter((_, i) => i !== idx) })}>Remove</button></li>
        ))}
      </ul>
    </div>
  );
};

// Accordion editor
const AccordionBlockEditor: React.FC<{ config: Record<string, any>; onChange: (cfg: Record<string, any>) => void }> = ({ config, onChange }) => {
  const items: { title: string; content: string }[] = config.items || [];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  return (
    <div>
      <label className="block font-semibold mb-1">Accordion Items</label>
      <div className="flex gap-2 mb-2">
        <input className="flex-1 border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title..." />
        <input className="flex-1 border rounded px-3 py-2" value={content} onChange={e => setContent(e.target.value)} placeholder="Content..." />
        <button type="button" className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => { if (title && content) { onChange({ ...config, items: [...items, { title, content }] }); setTitle(''); setContent(''); } }}>Add</button>
      </div>
      <ul className="list-disc ml-6">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">{item.title}: {item.content} <button type="button" className="text-red-600" onClick={() => onChange({ ...config, items: items.filter((_, i) => i !== idx) })}>Remove</button></li>
        ))}
      </ul>
    </div>
  );
};

export default LessonBuilder;
