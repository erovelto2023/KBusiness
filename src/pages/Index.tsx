
import { Button } from "../components/ui/button";
import { ArrowRight, BookOpen, Users, Search, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* HERO SECTION */}
      <section className="pt-24 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-4 drop-shadow-lg">Digital Marketing Newbies</h1>
        <div className="text-xl md:text-2xl text-blue-700 mb-6 font-semibold">Learn, Launch, and Grow Your Online Business</div>

        <p className="max-w-2xl mx-auto text-gray-600 mb-8 text-lg">The all-in-one platform for aspiring entrepreneurs: take online classes, explore niche markets, research trends, and manage your digital business with confidence.</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white text-lg px-8 py-4 rounded-xl font-bold shadow" onClick={() => navigate("/classes")}>Explore Classes <BookOpen className="ml-2 w-5 h-5" /></Button>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl font-bold shadow" onClick={() => navigate("/forum")}>Join Community <Users className="ml-2 w-5 h-5" /></Button>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center">
          <BookOpen className="w-10 h-10 text-blue-700 mb-3" />
          <h2 className="font-bold text-xl mb-2 text-blue-900">Online Classes</h2>
          <p className="text-gray-600 mb-4 text-center">Master digital marketing, e-commerce, and business skills at your own pace. Courses for all levels.</p>
          <Button variant="outline" onClick={() => navigate("/classes")}>Browse Classes <ArrowRight className="ml-1 w-4 h-4" /></Button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center">
          <Users className="w-10 h-10 text-green-600 mb-3" />
          <h2 className="font-bold text-xl mb-2 text-blue-900">Community</h2>
          <p className="text-gray-600 mb-4 text-center">Get help, share wins, and connect with other digital marketing newbies. Friendly, supportive, and open to all.</p>
          <Button variant="outline" onClick={() => navigate("/forum")}>Join Now <ArrowRight className="ml-1 w-4 h-4" /></Button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center">
          <Search className="w-10 h-10 text-purple-600 mb-3" />
          <h2 className="font-bold text-xl mb-2 text-blue-900">Research Tools</h2>
          <p className="text-gray-600 mb-4 text-center">Analyze keywords, trends, and products. Use our suite of tools to find your next big idea or optimize your business.</p>
          <Button variant="outline" onClick={() => navigate("/tools")}>Try Tools <ArrowRight className="ml-1 w-4 h-4" /></Button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center">
          <BarChart2 className="w-10 h-10 text-orange-500 mb-3" />
          <h2 className="font-bold text-xl mb-2 text-blue-900">Niche Explorer</h2>
          <p className="text-gray-600 mb-4 text-center">Discover and compare niche markets. Find what’s trending and where you can stand out.</p>
          <Button variant="outline" onClick={() => navigate("/tools")}>Explore Niches <ArrowRight className="ml-1 w-4 h-4" /></Button>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-blue-700 py-16 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Start Your Digital Journey?</h2>
        <p className="text-lg mb-8">Join Digital Marketing Newbies and unlock the tools, knowledge, and support you need to succeed online.</p>
        <Button size="lg" className="bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-xl shadow" onClick={() => navigate("/classes")}>Get Started</Button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 py-8 mt-12 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
          <div className="text-lg font-bold text-blue-900">Digital Marketing Newbies</div>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">

            <a href="#" className="text-gray-600 hover:text-blue-700">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-700">Contact</a>
            <a href="#" className="text-gray-600 hover:text-blue-700">Community</a>
            <a href="#" className="text-gray-600 hover:text-blue-700">Classes</a>
            <a href="#" className="text-gray-600 hover:text-blue-700">Tools</a>
          </div>
          <div className="text-gray-400 text-sm mt-4 md:mt-0"> 2025 Digital Marketing Newbies. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
