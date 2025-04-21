import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

// Mocked results for now
const mockProducts = [
  {
    id: "B07XYZ1234",
    title: "Travel Laptop Backpack for Women, 15.6 Inch",
    category: "Laptop Bags",
    price: "$29.99",
    rating: 4.7,
    reviews: 13241,
    link: "https://www.amazon.com/dp/B07XYZ1234"
  },
  {
    id: "B09TXYZ567",
    title: "SHRRADOO Extra Large 52L Travel Laptop Backpack",
    category: "Laptop Bags",
    price: "$39.99",
    rating: 4.8,
    reviews: 9935,
    link: "https://www.amazon.com/dp/B09TXYZ567"
  }
];

const AmazonProductFinder: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockProducts>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setResults(mockProducts);
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: 0 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px 32px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#232f3e', marginBottom: 10 }}>Amazon Product Finder</h1>
        <div style={{ fontSize: 18, color: '#555', marginBottom: 30 }}>Search and analyze Amazon products for your niche.</div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter a product, keyword, or ASIN..."
            style={{ flex: 1, padding: 12, borderRadius: 8, border: '1.5px solid #232f3e', fontSize: 18 }}
            required
          />
          <button type="submit" style={{ background: '#232f3e', color: '#fff', border: 'none', borderRadius: 8, padding: '0 22px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <FaSearch /> Search
          </button>
        </form>
        {loading && <div style={{ color: '#232f3e', fontWeight: 600, fontSize: 18 }}>Searching...</div>}
        {results.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px 0 #232f3e14', padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr style={{ color: '#232f3e', fontWeight: 600 }}>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Product ID</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Title</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Category</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Price</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Rating</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Reviews</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Link</th>
                </tr>
              </thead>
              <tbody>
                {results.map(product => (
                  <tr key={product.id}>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{product.id}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{product.title}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2', color: '#888' }}>{product.category}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{product.price}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{product.rating}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{product.reviews}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>
                      <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: '#232f3e', textDecoration: 'underline' }}>View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmazonProductFinder;
