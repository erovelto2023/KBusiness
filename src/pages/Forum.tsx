import React, { useState } from "react";

// Mock data for demonstration
const mockCategories = [
  { id: 1, name: "General Discussion" },
  { id: 2, name: "Affiliate Marketing" },
  { id: 3, name: "Pinterest Strategies" },
  { id: 4, name: "Amazon Products" },
];

const mockThreads = [
  { id: 1, categoryId: 1, title: "Welcome to the Forum!", author: "Admin", replies: 3, lastPost: "2025-04-16" },
  { id: 2, categoryId: 2, title: "Best Affiliate Networks?", author: "Alice", replies: 6, lastPost: "2025-04-15" },
  { id: 3, categoryId: 3, title: "How to grow Pinterest boards?", author: "Bob", replies: 2, lastPost: "2025-04-14" },
];

const Forum: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredThreads = mockThreads.filter(
    t => (!selectedCategory || t.categoryId === selectedCategory) && t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: 0 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px 32px 16px' }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: '#4b5563', marginBottom: 10 }}>Community Forum</h1>
        <div style={{ display: 'flex', gap: 24, marginBottom: 28 }}>
          <select value={selectedCategory ?? ""} onChange={e => setSelectedCategory(e.target.value ? Number(e.target.value) : null)} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16 }}>
            <option value="">All Categories</option>
            {mockCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search threads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16 }}
          />
          <button style={{ background: '#4b5563', color: '#fff', border: 'none', borderRadius: 8, padding: '0 22px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>New Thread</button>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px 0 #4b556314', padding: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
            <thead>
              <tr style={{ color: '#4b5563', fontWeight: 600 }}>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Title</th>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Category</th>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Author</th>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Replies</th>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Last Post</th>
              </tr>
            </thead>
            <tbody>
              {filteredThreads.map(thread => (
                <tr key={thread.id}>
                  <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2', color: '#2563eb', cursor: 'pointer' }}>{thread.title}</td>
                  <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{mockCategories.find(c => c.id === thread.categoryId)?.name}</td>
                  <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{thread.author}</td>
                  <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{thread.replies}</td>
                  <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{thread.lastPost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Classic features: categories, search, threads, new thread button, reply count, last post */}
      </div>
    </div>
  );
};

export default Forum;
