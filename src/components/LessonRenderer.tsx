import React from 'react';
import { LessonBlock } from './LessonBuilder';

interface LessonRendererProps {
  title: string;
  blocks: LessonBlock[];
  onMarkComplete?: () => void;
  completed?: boolean;
}

const LessonRenderer: React.FC<LessonRendererProps> = ({ title, blocks, onMarkComplete, completed }) => {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      {blocks.length === 0 && <div className="text-gray-500">No content for this lesson.</div>}
      {blocks.map((block, idx) => (
        <div key={block.id} className="mb-8">
          <LessonBlockDisplay block={block} />
        </div>
      ))}
      {onMarkComplete && (
        <button
          className={`mt-6 px-6 py-2 rounded ${completed ? 'bg-green-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-800'}`}
          onClick={onMarkComplete}
          disabled={completed}
        >
          {completed ? 'Completed' : 'Mark As Completed'}
        </button>
      )}
    </div>
  );
};

const LessonBlockDisplay: React.FC<{ block: LessonBlock }> = ({ block }) => {
  switch (block.type) {
    case 'video':
      return (
        <div>
          <div className="aspect-video mb-2">
            <iframe
              src={block.config.url}
              title="Video"
              className="w-full h-full rounded"
              allowFullScreen
            />
          </div>
        </div>
      );
    case 'content':
      return (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.config.text || '' }} />
      );
    case 'checklist':
      return (
        <div>
          <h3 className="font-semibold mb-2">Checklist</h3>
          <ul className="list-disc ml-6">
            {(block.config.items || []).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case 'accordion':
      return (
        <div>
          <h3 className="font-semibold mb-2">Accordion</h3>
          <div>
            {(block.config.items || []).map((item: { title: string; content: string }, idx: number) => (
              <details key={idx} className="mb-2">
                <summary className="font-semibold cursor-pointer">{item.title}</summary>
                <div className="ml-4 mt-1">{item.content}</div>
              </details>
            ))}
          </div>
        </div>
      );
    case 'audio':
      return (
        <div>
          <h3 className="font-semibold mb-2">Audio</h3>
          <audio controls src={block.config.url} className="w-full" />
        </div>
      );
    case 'download':
      return (
        <div>
          <a href={block.config.url} download className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {block.config.label || 'Download File'}
          </a>
        </div>
      );
    case 'pdf':
      return (
        <div>
          <h3 className="font-semibold mb-2">{block.config.title || 'PDF Section'}</h3>
          <iframe src={block.config.url} className="w-full h-96 border rounded" title="PDF" />
        </div>
      );
    default:
      return null;
  }
};

export default LessonRenderer;
