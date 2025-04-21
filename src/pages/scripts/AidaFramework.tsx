import React from "react";
import ToolPageLayout from "../../components/ToolPageLayout";

const AidaFramework: React.FC = () => {
  return (
    <ToolPageLayout>
      {/* Add prompt fields here later */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Prompt Input 1</label>
          <textarea className="w-full border rounded p-2 min-h-[60px]" placeholder="Enter details..." />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default AidaFramework;
