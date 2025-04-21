import React from "react";
import { FaSearch, FaChartLine, FaThumbtack, FaRegClipboard, FaUsers, FaRegCommentDots } from "react-icons/fa";
import { MdInsights } from "react-icons/md";

const tools = [
  {
    title: "Keywords",
    description: "Discover and analyze trending Pinterest keywords.",
    icon: <FaSearch size={36} style={{ color: '#e60023' }} />,
    href: "/pinterest-keywords",
    bg: "#fff0f3"
  },
  {
    title: "Trends",
    description: "Explore Pinterest trends and insights.",
    icon: <FaChartLine size={36} style={{ color: '#e60023' }} />,
    href: "/pinterest-trends",
    bg: "#f9f6ff"
  },
  {
    title: "Pins",
    description: "Analyze pins and their performance.",
    icon: <FaThumbtack size={36} style={{ color: '#e60023' }} />,
    href: "/pinterest-pins",
    bg: "#f0f8ff"
  },
  {
    title: "Boards",
    description: "Manage and research Pinterest boards.",
    icon: <FaRegClipboard size={36} style={{ color: '#e60023' }} />,
    href: "/pinterest-boards",
    bg: "#fff8e1"
  },
  {
    title: "People",
    description: "Find and analyze Pinterest users.",
    icon: <FaUsers size={36} style={{ color: '#e60023' }} />,
    href: "/pinterest-people",
    bg: "#e1f7fa"
  },
  {
    title: "Annotations",
    description: "Get keyword and trend annotations.",
    icon: <FaRegCommentDots size={36} style={{ color: '#e60023' }} />,
    href: "/pinterest-annotations",
    bg: "#f3f7fa"
  },

];

const PinterestInspector: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #fff0f3 0%, #fafbfc 60%, #e1f7fa 100%)',
        padding: 0,
        margin: 0,
      }}
    >
      <div style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '48px 16px 32px 16px',
        position: 'relative',
      }}>
        {/* Scheduler FAB */}
        <a
          href="/pinterest-scheduler"
          title="Go to Scheduler"
          style={{
            position: 'absolute',
            top: 28,
            right: 16,
            background: '#e60023',
            color: '#fff',
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px 0 rgba(230,0,35,0.18)',
            zIndex: 2,
            fontSize: 32,
            textDecoration: 'none',
            transition: 'box-shadow 0.18s, transform 0.13s',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px 0 rgba(230,0,35,0.23)';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.08)';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 18px 0 rgba(230,0,35,0.18)';
            (e.currentTarget as HTMLAnchorElement).style.transform = '';
          }}
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M17 3v2H7V3H5v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3h-2Zm3 16H4V9h16v10ZM4 7V5h1v2h2V5h10v2h2V5h1v2H4Z"/></svg>
        </a>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: -1,
            color: '#e60023',
            marginBottom: 8,
            fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          }}
        >
          Pinterest Inspector
        </h1>
        <div
          style={{
            fontSize: 20,
            color: '#444',
            marginBottom: 36,
            fontWeight: 400,
            fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          }}
        >
          All your Pinterest research tools in one place.
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 32,
            marginTop: 12,
          }}
        >
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.href}
              style={{
                background: tool.bg,
                borderRadius: 18,
                boxShadow: '0 3px 16px 0 rgba(230,0,35,0.08)',
                padding: '36px 28px 28px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#e60023',
                fontWeight: 700,
                fontSize: 22,
                border: '1.5px solid #e60023',
                transition: 'transform 0.16s cubic-bezier(.4,2,.6,1), box-shadow 0.16s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px) scale(1.03)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px 0 rgba(230,0,35,0.13)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = '';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 3px 16px 0 rgba(230,0,35,0.08)';
              }}
            >
              <div style={{ marginBottom: 18 }}>{tool.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#e60023', textAlign: 'center' }}>{tool.title}</div>
              <div style={{ fontSize: 16, color: '#444', fontWeight: 400, textAlign: 'center', lineHeight: 1.4 }}>{tool.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinterestInspector;
