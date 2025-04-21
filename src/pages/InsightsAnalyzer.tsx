import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const mockResults = [
  { id: 1, question: "What is the 3-3-3 rule for cats?", parent: "cats", level: 1 },
  { id: 2, question: "What do cats love the most?", parent: "cats", level: 1 },
  { id: 3, question: "How long will a cat remember you?", parent: "cats", level: 1 },
  { id: 4, question: "What is the #1 smartest cat?", parent: "cats", level: 1 },
  { id: 5, question: "Are cats attached to their owners?", parent: "What is the 3-3-3 rule for cats?", level: 2 },
  { id: 6, question: "How long can a cat go without peeing?", parent: "What is the 3-3-3 rule for cats?", level: 2 },
];

const InsightsAnalyzer: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockResults>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 900);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: 0 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px 32px 16px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#e60023', marginBottom: 10 }}>Insights Analyzer</h1>
        <div style={{ fontSize: 18, color: '#555', marginBottom: 30 }}>Search Google "People Also Asked" questions for any topic or keyword.</div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter a keyword or topic..."
            style={{ flex: 1, padding: 12, borderRadius: 8, border: '1.5px solid #e60023', fontSize: 18 }}
            required
          />
          <button type="submit" style={{ background: '#e60023', color: '#fff', border: 'none', borderRadius: 8, padding: '0 22px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <FaSearch /> Search
          </button>
        </form>
        {loading && <div style={{ color: '#e60023', fontWeight: 600, fontSize: 18 }}>Searching...</div>}
        {results.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px 0 rgba(230,0,35,0.08)', padding: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr style={{ color: '#e60023', fontWeight: 600 }}>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Question</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Parent</th>
                  <th style={{ textAlign: 'left', paddingBottom: 8 }}>Level</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2' }}>{r.question}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2', color: '#888' }}>{r.parent}</td>
                    <td style={{ padding: '6px 0', borderBottom: '1px solid #f2f2f2', color: '#888' }}>{r.level}</td>
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

export default InsightsAnalyzer;
