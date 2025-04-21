import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-[#1b0c1a] border-t border-[#2a1633] py-8 mt-12">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
      <div>© {new Date().getFullYear()} kage. All rights reserved.</div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <a href="#" className="hover:text-pink-400">Privacy Policy</a>
        <a href="#" className="hover:text-pink-400">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer;
