import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const mockImages = [
  // Replace with real images from backend in future
  { url: "/sample1.jpg", id: 1 },
  { url: "/sample2.jpg", id: 2 },
  { url: "/sample3.jpg", id: 3 },
  { url: "/sample4.jpg", id: 4 },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PinterestSelectImage: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const date = query.get("date");

  const handleSelect = (img: any) => {
    navigate("/pinterest-create-post", { state: { image: img, date } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc', padding: 0 }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 16px 32px 16px', textAlign: 'center' }}>
        <div style={{ fontWeight: 500, fontSize: 18, color: '#e60023', marginBottom: 10 }}>
          Scheduling for: <span style={{ fontWeight: 700 }}>{date}</span>
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#e60023', marginBottom: 20 }}>Select a Pin Image</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {mockImages.map(img => (
            <div key={img.id} style={{ border: '2px solid #e60023', borderRadius: 12, padding: 6, background: '#fff', cursor: 'pointer', transition: 'box-shadow 0.14s', boxShadow: '0 2px 8px 0 rgba(230,0,35,0.07)' }} onClick={() => handleSelect(img)}>
              <img src={img.url} alt="pin" style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 8 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinterestSelectImage;
