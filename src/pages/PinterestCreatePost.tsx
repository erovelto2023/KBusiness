import React from "react";
import { useLocation } from "react-router-dom";

const PinterestCreatePost: React.FC = () => {
  const location = useLocation();
  const image = location.state?.image;
  const date = location.state?.date;

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc', padding: 0 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px 32px 16px', display: 'flex', gap: 36 }}>
        {/* Left: Form */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#e60023', marginBottom: 24 }}>Create Pinterest Post</h2>
          <form>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Scheduled Date</label>
              <div style={{
                background: '#fff8e1',
                color: '#e60023',
                fontWeight: 600,
                borderRadius: 8,
                padding: '8px 14px',
                marginTop: 4,
                marginBottom: 4,
                fontSize: 16
              }}>{date || "Not selected"}</div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Title</label>
              <input type="text" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e60023', marginTop: 4 }} maxLength={100} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Caption</label>
              <textarea style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e60023', marginTop: 4, minHeight: 80 }} maxLength={800} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500 }}>Add Link</label>
              <input type="text" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e60023', marginTop: 4 }} maxLength={2048} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{ background: '#e60023', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', fontSize: 16 }}>Publish</button>
              <button type="button" style={{ background: '#eee', color: '#e60023', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', fontSize: 16 }}>Save as draft</button>
            </div>
          </form>
        </div>
        {/* Right: Preview */}
        <div style={{ width: 320, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px 0 rgba(230,0,35,0.08)', padding: 22, alignSelf: 'flex-start' }}>
          <div style={{ fontWeight: 700, color: '#e60023', fontSize: 20, marginBottom: 8 }}>Pinterest</div>
          {image ? (
            <img src={image.url} alt="pin preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
          ) : (
            <div style={{ width: '100%', height: 180, background: '#eee', borderRadius: 8, marginBottom: 12 }} />
          )}
          <div style={{ fontWeight: 500, color: '#333', fontSize: 16 }}>DigitalMarketingNewbies</div>
          <div style={{ color: '#aaa', fontSize: 14 }}>Scheduled: {date || "Not selected"}</div>
        </div>
      </div>
    </div>
  );
};

export default PinterestCreatePost;
