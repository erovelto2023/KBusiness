import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/lms/dashboard", label: "Dashboard" },
  { to: "/lms/catalog", label: "Course Catalog" },
];

const StudentLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-6">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-4">
          {navItems.map(item => {
            let isActive = false;
            if (item.to === "/lms/dashboard" && location.pathname === "/lms/dashboard") isActive = true;
            if (item.to === "/lms/catalog" && (location.pathname === "/lms/catalog" || location.pathname.startsWith("/lms/course/"))) isActive = true;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`font-semibold px-3 py-2 rounded hover:bg-blue-100 transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
