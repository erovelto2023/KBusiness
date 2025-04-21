import React from "react";
import { Link, Outlet, NavLink } from "react-router-dom";



const AdminDashboard: React.FC = () => {
  // Placeholder stats
  const stats = [
    { title: "Students", value: "13,862", change: "+19.7%", color: "text-blue-600" },
    { title: "Teachers", value: "765", change: "+3.1%", color: "text-orange-600" },
    { title: "Awards", value: "24", change: "+1.6%", color: "text-green-600" },
    { title: "Revenue", value: "$6,235", change: "+4.8%", color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
        <div className="px-6 py-6 flex items-center gap-2 border-b">
          <span className="font-bold text-xl text-blue-700">zynix</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold ${isActive ? 'text-blue-700 bg-blue-50' : 'hover:bg-gray-100'}`} end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/classes" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:bg-gray-100'}`}>
            Classes
          </NavLink>
          <NavLink to="/admin/courses" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:bg-gray-100'}`}>
            Courses
          </NavLink>
          <NavLink to="/admin/lessons" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:bg-gray-100'}`}>
            Lessons
          </NavLink>
          <NavLink to="/admin/assignments" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:bg-gray-100'}`}>
            Assignments
          </NavLink>
          <NavLink to="/admin/blogmanager" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'text-blue-700 bg-blue-50 font-semibold' : 'hover:bg-gray-100'}`}>
            Blog Manager
          </NavLink>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b flex items-center justify-between px-8 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
          <div className="flex items-center gap-6">
            <button className="relative">
              <span className="material-icons text-gray-500">notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">3</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="material-icons text-gray-500">account_circle</span>
              <span className="font-medium text-gray-700">Admin</span>
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
          {/* Admin Function Cards */}
                  <h2 className="text-2xl font-bold mb-4">Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* 1. Manage Courses */}
            <Link to="/admin/courses" className="bg-white rounded-xl shadow p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
              <div>
                <div className="flex items-center mb-2">
                  
                  <span className="font-bold text-lg">Manage Courses</span>
                </div>
                <div className="text-gray-500 text-sm mb-3">Create and manage LMS courses.</div>
              </div>
              <span className="mt-4 bg-blue-700 text-white py-2 px-4 rounded text-center">Go to Courses</span>
            </Link>
            {/* 2. Manage Classes */}
            <Link to="/admin/classes" className="bg-white rounded-xl shadow p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
              <div>
                <div className="flex items-center mb-2">
                  
                  <span className="font-bold text-lg">Manage Classes</span>
                </div>
                <div className="text-gray-500 text-sm mb-3">Add, edit, and organize LMS classes.</div>
              </div>
              <span className="mt-4 bg-green-700 text-white py-2 px-4 rounded text-center">Go to Classes</span>
            </Link>
            {/* 3. Manage Lessons */}
            <Link to="/admin/lessons" className="bg-white rounded-xl shadow p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
              <div>
                <div className="flex items-center mb-2">
                  
                  <span className="font-bold text-lg">Manage Lessons</span>
                </div>
                <div className="text-gray-500 text-sm mb-3">Add and edit lessons for courses.</div>
              </div>
              <span className="mt-4 bg-orange-700 text-white py-2 px-4 rounded text-center">Go to Lessons</span>
            </Link>
            {/* 4. Manage Assignments */}
            <Link to="/admin/assignments" className="bg-white rounded-xl shadow p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
              <div>
                <div className="flex items-center mb-2">
                  
                  <span className="font-bold text-lg">Manage Assignments</span>
                </div>
                <div className="text-gray-500 text-sm mb-3">Create and manage assignments and quizzes.</div>
              </div>
              <span className="mt-4 bg-purple-700 text-white py-2 px-4 rounded text-center">Go to Assignments</span>
            </Link>
          </div>

          {/* Content Creation Section */}
          <h2 className="text-2xl font-bold mb-6">Content Creation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link to="/admin/blogmanager" className="bg-white rounded-xl shadow p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition">
              <div>
                <div className="flex items-center mb-2">
                  
                  <span className="font-bold text-lg">Blog Manager</span>
                </div>
                <div className="text-gray-500 text-sm mb-3">Create, edit, and manage blog posts just like WordPress.</div>
              </div>
              <span className="mt-4 bg-blue-700 text-white py-2 px-4 rounded text-center">Go to Blog Manager</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
