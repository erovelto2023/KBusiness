import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { BlogPost } from "../../types";
import { useNavigate } from "react-router-dom";

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "blogPosts", id));
  };

  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
        <div className="px-6 py-6 flex items-center gap-2 border-b">
          <span className="font-bold text-xl text-blue-700">zynix</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</a>
          <a href="/admin/classes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">Classes</a>
          <a href="/admin/courses" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">Courses</a>
          <a href="/admin/lessons" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">Lessons</a>
          <a href="/admin/assignments" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">Assignments</a>
          <a href="/admin/blogmanager" className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-700 bg-blue-50 font-semibold">Blog Manager</a>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b flex items-center justify-between px-8 py-4 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-900">Posts</h1>
          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={() => navigate('/admin/blogmanager/new')}>Add Post</button>
        </header>
        <main className="p-8 flex-1 overflow-y-auto">

          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={() => navigate('/admin/blogmanager/new')}
            >
              Add Blog Post
            </button>
          </div>

          <div className="bg-white rounded shadow p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2 font-semibold">Title</th>
                  <th className="py-2 px-2 font-semibold">Author</th>
                  <th className="py-2 px-2 font-semibold">Stats</th>
                  <th className="py-2 px-2 font-semibold">Date</th>
                  <th className="py-2 px-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5}>Loading...</td></tr>
                ) : posts.length === 0 ? (
                  <tr><td colSpan={5}>No blog posts found.</td></tr>
                ) : posts.map(post => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">
                      <a
  href={`/blog/${post.slug}`}
  className="font-medium text-blue-700 cursor-pointer hover:underline"
  target="_blank"
  rel="noopener noreferrer"
>
  {post.title}
</a>
                    </td>
                    <td className="py-2 px-2">{post.author}</td>
                    <td className="py-2 px-2">👁️ {post.views ?? 0}</td>
                    <td className="py-2 px-2">{post.status} <br /> {post.date}</td>
                    <td className="py-2 px-2">
                      <button
  className="text-blue-600 hover:underline mr-2"
  onClick={() => navigate(`/admin/blogmanager/edit/${post.id}`)}
>
  Edit
</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDelete(post.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogManager;
