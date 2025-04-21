import React from "react";

export type LessonType = "video" | "text" | "quiz";

interface Props {
  value: LessonType;
  onChange: (type: LessonType) => void;
}

const LessonTypeSelector: React.FC<Props> = ({ value, onChange }) => (
  <div className="flex gap-4 mb-4">
    <label className="flex items-center gap-2">
      <input type="radio" name="lessonType" value="video" checked={value === "video"} onChange={() => onChange("video")}/>
      Video
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name="lessonType" value="text" checked={value === "text"} onChange={() => onChange("text")}/>
      Text
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name="lessonType" value="quiz" checked={value === "quiz"} onChange={() => onChange("quiz")}/>
      Quiz
    </label>
  </div>
);

export default LessonTypeSelector;
