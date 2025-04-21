
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { StatsCard } from "../components/dashboard/StatsCard";
import { ProgramTable } from "../components/dashboard/ProgramTable";
import { Program } from "../types";
import { Activity, DollarSign, ShoppingCart } from "lucide-react";
import { toast } from "../hooks/use-toast";

const Dashboard = () => {
  // Placeholder stats
  const stats = [
    { title: "Students", value: "13,862", change: "+19.7%", color: "text-blue-600" },
    { title: "Teachers", value: "765", change: "+3.1%", color: "text-orange-600" },
    { title: "Awards", value: "24", change: "+1.6%", color: "text-green-600" },
    { title: "Revenue", value: "$6,235", change: "+4.8%", color: "text-purple-600" },
  ];
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dashboard loaded",
        description: "Your latest data has been refreshed",
        duration: 3000,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const programs: Program[] = [
    {
      id: "1",
      name: "Groove",
      category: "SaaS",
      platform: "GrooveFunnels",
      commission: "40% recurring",
      description: "All-in-one marketing platform",
      sales: 100,
      earned: 2000,
    },
    {
      id: "2",
      name: "TravelPro",
      category: "Travel",
      platform: "TravelAffiliates",
      commission: "10% per booking",
      description: "Exclusive travel deals",
      sales: 75,
      earned: 850,
    },
    {
      id: "3",
      name: "FitPro",
      category: "Fitness",
      platform: "FitAffiliates",
      commission: "15% per sale",
      description: "Premium fitness products",
      sales: 50,
      earned: 600,
    },
    {
      id: "4",
      name: "TechWorld",
      category: "Technology",
      platform: "TechAffiliates",
      commission: "12% per sale",
      description: "Latest tech gadgets",
      sales: 30,
      earned: 450,
    },
  ];

  const SimpleBarChart = () => (
    <div className="w-full h-10 flex items-end">
      <div className="h-6 w-3 bg-affiliate-purple rounded-sm mr-1"></div>
      <div className="h-10 w-3 bg-affiliate-purple rounded-sm mr-1"></div>
      <div className="h-4 w-3 bg-affiliate-purple rounded-sm mr-1"></div>
      <div className="h-8 w-3 bg-affiliate-purple rounded-sm"></div>
    </div>
  );

  const CircleChart = () => (
    <div className="w-20 h-20 relative mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeDasharray="75, 100"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
        75%
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
        <div className="px-6 py-6 flex items-center gap-2 border-b">
          <span className="font-bold text-xl text-blue-700">zynix</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-50 font-semibold w-full">
            <span className="material-icons">dashboard</span> Dashboard
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 w-full">
            <span className="material-icons">class</span> Classes
          </button>
          {/* Add more sidebar links here */}
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b flex items-center justify-between px-8 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
          <div className="flex items-center gap-6">
            <button className="relative">
              <span className="material-icons text-gray-500">notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">3</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-500">account_circle</span>
              <span className="font-medium text-gray-700">User</span>
            </div>
          </div>
        </header>
        {/* Summary Cards */}
        <main className="p-8 bg-gray-50 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
                <div className="text-gray-500 text-sm mb-2">{stat.title}</div>
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-semibold text-green-500">{stat.change}</div>
              </div>
            ))}
          </div>
          {/* Add more dashboard widgets here (charts, tables, etc.) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>
              {/* Placeholder for chart */}
              <div className="h-40 bg-gray-100 rounded" />
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Events Calendar</h2>
              {/* Placeholder for calendar */}
              <div className="h-40 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Notice Board</h2>
              {/* Placeholder for notice board */}
              <div className="h-32 bg-gray-100 rounded" />
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Fee Details</h2>
              {/* Placeholder for fee details */}
              <div className="h-32 bg-gray-100 rounded" />
            </div>
          </div>
          {/* Quick Tools Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: "1",
                  title: "Email Swipes",
                  description: "Pre-written email templates for promoting affiliate products.",
                  route: "/email-swipes",
                },
                {
                  id: "2",
                  title: "Banners",
                  description: "High-converting banner ads in multiple sizes.",
                  route: "/banners",
                },
                {
                  id: "3",
                  title: "Product Reviews",
                  description: "Detailed product review templates you can customize.",
                  route: "/product-reviews",
                },
                {
                  id: "4",
                  title: "PPC Ads",
                  description: "Pay-per-click ad templates for Google, Facebook, and more.",
                  route: "/ppc-ads",
                },
                {
                  id: "5",
                  title: "Autoresponder Sequences",
                  description: "Multi-day email sequences to nurture leads.",
                  route: "/autoresponder-sequences",
                },
                {
                  id: "6",
                  title: "Q & A",
              description: "Frequently asked questions and answers about products.",
              route: "/q-and-a",
            },
            {
              id: "7",
              title: "Prompt Library",
              description: "Collection of AI prompts for affiliate marketing content.",
              route: "/prompt-library",
            },
          ].map((tool) => (
            <div
              key={tool.id}
              className="rounded-lg border bg-white shadow-sm p-6 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              onClick={() => navigate(tool.route)}
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
              </div>
              <button className="mt-auto bg-affiliate-purple text-white py-2 px-4 rounded hover:bg-affiliate-purple/90 transition-all">
                Open Tool
              </button>
            </div>
          ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
