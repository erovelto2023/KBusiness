import React, { useState } from "react";

// Pinterest API endpoint and types
const PINTEREST_KEYWORD_ENDPOINT = "https://api.pinterest.com/v5/keywords/get";

interface KeywordData {
  keyword: string;
  rank: number;
  wordCount: number;
  charCount: number;
  seed: string;
  monthlySearches?: number;
  cpc?: number;
  competition?: string;
}

import { FaSort, FaSearch } from "react-icons/fa";

const columns = [
  { label: "Rank", key: "rank" },
  { label: "Word Count", key: "wordCount" },
  { label: "Character Count", key: "charCount" },
  { label: "Seed", key: "seed" },
  { label: "Keyword", key: "keyword" },
  { label: "Monthly Searches", key: "monthlySearches" },
  { label: "CPC", key: "cpc" },
  { label: "Competition", key: "competition" },
];

const OAUTH_HELPER_URL = "http://localhost:5000/oauth-url";

const PinterestKeywordTool: React.FC = () => {
  const [seed, setSeed] = useState("");
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [activeTab, setActiveTab] = useState("keywords");
  const [searchRange, setSearchRange] = useState("after");
  const [accessToken, setAccessToken] = useState<string>(() => localStorage.getItem("pinterest_access_token") || "");

  // Save token to localStorage when it changes
  React.useEffect(() => {
    if (accessToken) localStorage.setItem("pinterest_access_token", accessToken);
    else localStorage.removeItem("pinterest_access_token");
  }, [accessToken]);

  const isConnected = !!accessToken;

  // Generate keyword variations based on search range
  const getKeywordVariants = (seed: string, mode: string): string[] => {
    const az09 = [
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), // a-z
      ...Array.from({ length: 10 }, (_, i) => String(i)), // 0-9
    ];
    const aaZZ = [];
    for (let i = 97; i <= 122; i++) {
      for (let j = 97; j <= 122; j++) {
        aaZZ.push(String.fromCharCode(i) + String.fromCharCode(j));
      }
    }
    switch (mode) {
      case "after":
        return az09.map(ch => `${seed} ${ch}`);
      case "before":
        return az09.map(ch => `${ch} ${seed}`);
      case "both":
        return az09.flatMap(ch => [`${ch} ${seed}`, `${seed} ${ch}`]);
      case "aa-after":
        return aaZZ.map(ch => `${seed} ${ch}`);
      default:
        return [seed];
    }
  };

  const fetchKeywords = async () => {
    if (!accessToken) {
      setError("Please connect your Pinterest account first.");
      return;
    }
    setLoading(true);
    setError("");
    setKeywords([]);
    try {
      const queries = getKeywordVariants(seed, searchRange);
      let allResults: KeywordData[] = [];
      for (const q of queries) {
        const response = await fetch(
          "http://localhost:5001/api/pinterest/keywords?seed=" + encodeURIComponent(q),
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) continue;
        const data = await response.json();
        if (data.keywords && Array.isArray(data.keywords)) {
          allResults = allResults.concat(data.keywords);
        }
      }
      setKeywords(allResults);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const sortedFiltered = keywords
    .filter(k =>
      columns.some(col =>
        String(k[col.key as keyof KeywordData] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (a[sortBy as keyof KeywordData] === b[sortBy as keyof KeywordData]) return 0;
      if (sortAsc) {
        return a[sortBy as keyof KeywordData]! > b[sortBy as keyof KeywordData]! ? 1 : -1;
      } else {
        return a[sortBy as keyof KeywordData]! < b[sortBy as keyof KeywordData]! ? 1 : -1;
      }
    });

  return (
    <div style={{ padding: 24, background: '#fafbfc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
        <button
          style={{
            padding: '8px 16px',
            background: isConnected ? '#43a047' : '#d32f2f',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: 8,
          }}
          onClick={() => window.open(OAUTH_HELPER_URL, '_blank')}
        >{isConnected ? 'Pinterest Connected' : 'Connect Pinterest'}</button>
        <input
          type="text"
          value={accessToken}
          onChange={e => setAccessToken(e.target.value)}
          placeholder="Paste Pinterest Access Token here"
          style={{ padding: 8, width: 320, border: '1px solid #ccc', borderRadius: 4, marginRight: 8 }}
        />
        {isConnected && (
          <span style={{ color: '#43a047', fontWeight: 'bold' }}>Connected</span>
        )}
        {!isConnected && (
          <span style={{ color: '#d32f2f' }}>Not Connected</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <button
          style={{
            border: 'none', background: activeTab === 'keywords' ? '#d32f2f' : '#eee', color: activeTab === 'keywords' ? '#fff' : '#333',
            fontWeight: 'bold', padding: '8px 18px', marginRight: 6, borderRadius: 4, cursor: 'pointer',
          }}
          onClick={() => setActiveTab('keywords')}
        >Keywords Everywhere</button>
        <button
          style={{
            border: 'none', background: activeTab === 'volume' ? '#d32f2f' : '#eee', color: activeTab === 'volume' ? '#fff' : '#333',
            fontWeight: 'bold', padding: '8px 18px', marginRight: 16, borderRadius: 4, cursor: 'pointer',
          }}
          onClick={() => setActiveTab('volume')}
        >Search Volume</button>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search keywords..."
          style={{ padding: 8, width: 220, marginLeft: 'auto', border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={seed}
          onChange={e => setSeed(e.target.value)}
          placeholder="Enter seed keyword"
          style={{ padding: 8, width: 220, marginRight: 8 }}
        />
        <select
          value={searchRange}
          onChange={e => setSearchRange(e.target.value)}
          style={{ padding: 8, marginRight: 8, borderRadius: 4 }}
        >
          <option value="after">a-z 0-9 after seed</option>
          <option value="before">a-z 0-9 before seed</option>
          <option value="both">a-z 0-9 before & after seed</option>
          <option value="aa-after">aa-ZZ after seed</option>
        </select>
        <button onClick={fetchKeywords} disabled={loading || !seed} style={{ padding: 8, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001' }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #eee', cursor: 'pointer', position: 'relative' }}
                  onClick={() => {
                    if (sortBy === col.key) setSortAsc(!sortAsc);
                    else { setSortBy(col.key); setSortAsc(true); }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FaSearch style={{ marginRight: 4, color: '#d32f2f', fontSize: 12 }} />
                    {col.label}
                    <FaSort style={{ marginLeft: 4, color: sortBy === col.key ? '#d32f2f' : '#bbb', fontSize: 12, transform: sortAsc ? 'scaleY(-1)' : 'none' }} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedFiltered.length === 0 && (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 24, color: '#888' }}>No keywords found.</td></tr>
            )}
            {sortedFiltered.map((k, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td>{k.rank}</td>
                <td>{k.wordCount}</td>
                <td>{k.charCount}</td>
                <td>{k.seed}</td>
                <td>{k.keyword}</td>
                <td>{k.monthlySearches || "-"}</td>
                <td>{k.cpc || "-"}</td>
                <td>{k.competition || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PinterestKeywordTool;
