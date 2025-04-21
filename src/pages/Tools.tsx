
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { Tool } from "../types";
import { useToast } from "../hooks/use-toast";

const Tools = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const tools: Tool[] = [

    {
      id: "pin-inspector",
      title: "Pin Inspector",
      description: "Analyze Pinterest keywords, trends, pins, boards, and people. Powered by Pinterest API.",
      category: "analytics",
      route: "/pinterest-inspector"
    },
    {
      id: "scripts-tools",
      title: "Scripts & Tools",
      description: "Run automation scripts to save time and streamline your workflow. Includes bulk link generation, data cleanup, and more.",
      category: "automation",
      route: "/manage-programs"
    },
    {
      id: "insights-analyzer",
      title: "Insights Analyzer",
      description: 'Find Google "People Also Asked" questions and keyword insights.',
      category: "research",
      route: "/insights-analyzer"
    },
    {
      id: "amazon-product-finder",
      title: "Amazon Product Finder",
      description: 'Search and analyze Amazon products for your niche.',
      category: "research",
      route: "/amazon-product-finder"
    },

  {
    id: "1",
    title: "Email Swipes",
    description: "Pre-written email templates for promoting affiliate products. Save time and boost conversions with professionally crafted emails.",
    category: "marketing",
    route: "/email-swipes"
  },
  {
    id: "2",
    title: "Banners",
    description: "High-converting banner ads in multiple sizes. Ready-to-use graphics that have been tested and optimized for maximum click-through rates.",
    category: "creative",
    route: "/banners"
  },
  {
    id: "3",
    title: "Product Reviews",
    description: "Detailed product review templates that you can customize. Includes pros, cons, and key selling points for better conversions.",
    category: "content",
    route: "/product-reviews"
  },
  {
    id: "4",
    title: "PPC Ads",
    description: "Pay-per-click ad templates for Google, Facebook, and other platforms. Copy that's been proven to drive traffic and sales.",
    category: "marketing",
    route: "/ppc-ads"
  },
  {
    id: "5",
    title: "Autoresponder Sequences",
    description: "Multi-day email sequences designed to nurture leads and increase sales. Strategically timed messages for maximum impact.",
    category: "marketing",
    route: "/autoresponder-sequences"
  },
  {
    id: "6",
    title: "Q & A",
    description: "Frequently asked questions and answers about products. Help overcome objections and provide valuable information to potential customers.",
    category: "content",
    route: "/q-and-a"
  },
  {
    id: "7",
    title: "Prompt Library",
    description: "Collection of AI prompts specifically designed for creating affiliate marketing content. Generate quality content faster.",
    category: "AI",
    route: "/prompt-library"
  }
];

  const filteredTools = tools
    .filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleLearnMore = (toolId: string) => {
  const tool = tools.find(t => t.id === toolId);
  if (tool?.id === "pin-inspector") {
    window.open("http://127.0.0.1:51231/pinterest-inspector", "_blank");
    return;
  }
  if (tool?.route) {
    navigate(tool.route);
    return;
  }
  toast({
    title: tool?.title,
    description: "Opening tool details",
  });
};

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Marketing Tools</h1>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wide text-gray-500">
                  {tool.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">
                  {tool.description}
                </p>
                <Button 
                  className="w-full bg-affiliate-purple hover:bg-affiliate-purple/90"
                  onClick={() => handleLearnMore(tool.id)}
                >
                  Learn more
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tools found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
