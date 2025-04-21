import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

const daysInMonth = 30;
const year = 2025;
const month = 3; // April (0-indexed for JS Date)

const PinterestScheduler: React.FC = () => {
  const navigate = useNavigate();

  const handleDateClick = (day: number) => {
    // Pass date as YYYY-MM-DD
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    navigate(`/pinterest-select-image?date=${dateStr}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff0f3 0%, #fafbfc 60%, #e1f7fa 100%)', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '56px 16px 32px 16px', textAlign: 'center' }}>
        <FaCalendarAlt size={48} style={{ color: '#e60023', marginBottom: 18 }} />
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#e60023', marginBottom: 10 }}>
          Pinterest Scheduler
        </h1>
        <div style={{ fontSize: 18, color: '#444', marginBottom: 32 }}>
          Select a date to start scheduling a Pinterest post.
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px 0 rgba(230,0,35,0.08)', padding: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 20, color: '#e60023', marginBottom: 14 }}>April 2025</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {[...Array(daysInMonth)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handleDateClick(i + 1)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  border: '1.5px solid #e60023',
                  background: '#fafbfc',
                  color: '#e60023',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  transition: 'background 0.13s, color 0.13s',
                  marginBottom: 3,
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#e60023';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#fafbfc';
                  (e.currentTarget as HTMLButtonElement).style.color = '#e60023';
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinterestScheduler;
