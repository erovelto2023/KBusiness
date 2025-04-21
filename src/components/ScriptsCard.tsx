import React from "react";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Terminal } from "lucide-react";

const scripts = [
  {
    name: "Bulk Link Generator",
    description: "Generate affiliate links in bulk from a CSV file.",
    action: () => alert("Coming soon: Bulk Link Generator")
  },
  {
    name: "Data Cleanup",
    description: "Remove duplicates and clean program data.",
    action: () => alert("Coming soon: Data Cleanup")
  },
  // Add more scripts as needed
];

const ScriptsCard: React.FC = () => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="h-6 w-6 text-affiliate-purple" />
          <CardTitle>Scripts & Tools</CardTitle>
        </div>
        <CardDescription>
          Run useful automation scripts to save time and streamline your workflow.
        </CardDescription>
        <div className="mt-4 space-y-4">
          {scripts.map((script, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 rounded p-3">
              <div>
                <div className="font-semibold text-gray-800">{script.name}</div>
                <div className="text-xs text-gray-500">{script.description}</div>
              </div>
              <Button size="sm" variant="outline" onClick={script.action}>
                Run
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-gray-400">More scripts coming soon...</span>
      </CardFooter>
    </Card>
  );
};

export default ScriptsCard;
