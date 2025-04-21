import React, { useState } from "react";
import { Link } from "react-router-dom";

const mockCourses = [
  {
    id: 1,
    title: "Affiliate Marketing 101",
    description: "Learn the basics of affiliate marketing, strategies, and tools.",
    teacher: "Jane Doe",
    category: "Marketing",
    upcoming: true
  },
  {
    id: 2,
    title: "Pinterest Growth Masterclass",
    description: "Grow your Pinterest account and drive traffic.",
    teacher: "John Smith",
    category: "Social Media",
    upcoming: false
  }
];

const roles = ["Student", "Teacher", "Admin", "Parent", "Guest"];

const Classes: React.FC = () => {
  const [role, setRole] = useState("Student");

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px 32px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: '#3b3b3b' }}>Classes</h1>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1.5px solid #bbb', fontSize: 16 }}>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 18, color: '#666' }}>
            {role === "Teacher" && (
              <>
                Welcome, Teacher! <Link to="/classes/create" style={{ color: '#5b21b6', textDecoration: 'underline', fontWeight: 600 }}>Create a new course</Link>
              </>
            )}
            {role === "Admin" && (
              <>
                Welcome, Admin! <Link to="/classes/create" style={{ color: '#5b21b6', textDecoration: 'underline', fontWeight: 600 }}>Create a new course</Link>
              </>
            )}
            {role === "Student" && (
              <>Welcome, Student! Here are your available and upcoming classes.</>
            )}
            {role === "Parent" && (
              <>Welcome, Parent! View your child's classes and progress.</>
            )}
            {role === "Guest" && (
              <>Welcome! Browse available classes below.</>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ flex: 2 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#3b3b3b', marginBottom: 12 }}>All Courses</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {mockCourses.map(course => (
                <div key={course.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px 0 #232f3e14', padding: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#5b21b6' }}>{course.title}</h3>
                  <div style={{ color: '#666', margin: '8px 0' }}>{course.description}</div>
                  <div style={{ fontSize: 15, color: '#888' }}>Teacher: {course.teacher}</div>
                  <div style={{ fontSize: 14, color: '#aaa', marginTop: 6 }}>Category: {course.category}</div>
                  <div style={{ marginTop: 12 }}>
                    <Link to={`/classes/${course.id}`} style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>View Course</Link>
                  </div>
                  {course.upcoming && <div style={{ marginTop: 8, color: '#059669', fontWeight: 600 }}>Upcoming</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#3b3b3b', marginBottom: 10 }}>Upcoming Classes</h2>
            <ul style={{ paddingLeft: 16 }}>
              {mockCourses.filter(c => c.upcoming).map(c => (
                <li key={c.id} style={{ marginBottom: 8 }}>
                  <Link to={`/classes/${c.id}`} style={{ color: '#059669', fontWeight: 600 }}>{c.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
