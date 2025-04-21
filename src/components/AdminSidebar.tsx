import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/admin/classes", icon: "class", label: "Classes" },
  { to: "/admin/courses", icon: "menu_book", label: "Courses" },
  { to: "/admin/lessons", icon: "import_contacts", label: "Lessons" },
  { to: "/admin/assignments", icon: "assignment", label: "Assignments" },
  { to: "/admin/blogmanager", icon: "article", label: "Blog Manager" },
];

const AdminSidebar: React.FC = () => (
  <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
    <div className="px-6 py-6 flex items-center gap-2 border-b">
      <span className="font-bold text-xl text-blue-700">zynix</span>
    </div>
    <nav className="flex-1 px-4 py-6 space-y-2">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:bg-gray-100'}`}
          end={link.to === "/admin/dashboard"}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
