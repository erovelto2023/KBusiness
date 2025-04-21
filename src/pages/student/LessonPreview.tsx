import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LessonType } from "../../components/LessonTypeSelector";

interface LessonPreviewProps {
  lesson: {
    title: string;
    type: LessonType;
    videoUrl?: string;
    textContent?: string;
    quizQuestions?: string;
  };
}

const LessonPreview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get lesson from state or localStorage
  let lesson = (location.state?.lesson || null) as LessonPreviewProps["lesson"] | null;
  const [loadedLesson, setLoadedLesson] = React.useState<LessonPreviewProps["lesson"] | null>(lesson);

  React.useEffect(() => {
    if (!lesson) {
      const stored = localStorage.getItem('lessonPreview');
      if (stored) {
        try {
          setLoadedLesson(JSON.parse(stored));
        } catch {
          setLoadedLesson(null);
        }
        localStorage.removeItem('lessonPreview');
      }
    }
    // eslint-disable-next-line
  }, []);

  if (!loadedLesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 relative text-center">
          <button
            className="absolute top-4 right-4 text-blue-700 hover:underline font-semibold"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <div className="text-gray-500 text-lg">No lesson found for preview.</div>
        </div>
      </div>
    );
  }
  lesson = loadedLesson;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 relative">
        <button
          className="absolute top-4 right-4 text-blue-700 hover:underline font-semibold"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">{lesson.title}</h1>
        <div className="mb-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
            {lesson.type}
          </span>
        </div>
        {lesson.type === "video" && lesson.videoUrl && (
          <div className="flex flex-col items-center">
            {lesson.videoUrl.match(/(youtube\.com|youtu\.be)/i) ? (
              <iframe
                className="w-full max-w-md rounded-lg border shadow mb-4 aspect-video"
                src={
                  lesson.videoUrl.includes("embed")
                    ? lesson.videoUrl
                    : lesson.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
                }
                title="YouTube video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls className="w-full max-w-md rounded-lg border shadow mb-4">
                <source src={lesson.videoUrl} />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="text-gray-400 text-xs">(Video preview)</div>
          </div>
        )}
        {lesson.type === "text" && lesson.textContent && (
          <div className="prose max-w-none text-lg leading-relaxed text-gray-800 bg-gray-50 rounded-lg p-4 mb-4 border"
            dangerouslySetInnerHTML={{ __html: lesson.textContent }}
          />
        )}
        {lesson.type === "quiz" && lesson.quizQuestions && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-2 text-yellow-900">Quiz</h2>
            <ul className="list-disc ml-6 text-yellow-900">
              {lesson.quizQuestions.split(",").map((q, i) => (
                <li key={i} className="mb-2">{q.trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPreview;
