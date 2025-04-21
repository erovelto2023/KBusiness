import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => (
  <header className="flex items-center justify-between py-6 px-4 md:px-12 bg-[#1b0c1a] border-b border-[#2a1633]">
    <div className="flex items-center gap-4">
      <span className="text-2xl font-bold tracking-tight">kage</span>
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-pink-400">Home</Link>
        <Link to="/" className="hover:text-pink-400">Main Site</Link>
      </nav>
    </div>
    <div className="flex gap-4">
      <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-semibold">Subscribe</button>
    </div>
  </header>
);

export default Header;
