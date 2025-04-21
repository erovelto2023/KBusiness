import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

const FinancialOrEarningsPressRelease: React.FC = () => {
  const [companyname, setCompanyname] = useState("");
  const [period, setPeriod] = useState("");
  const [revenue, setRevenue] = useState("");
  const [income, setIncome] = useState("");
  const [highlights, setHighlights] = useState("");
  const [spokesman, setSpokesman] = useState("");
  const [link, setLink] = useState("");
  const [prompt, setPrompt] = useState("");
  const [browserUrl, setBrowserUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

  // Prompt template
  const promptText = `FOR IMMEDIATE RELEASE:\n\n${companyname || "[Company Name]"} Announces Financial Results for ${period || "[Period]"}\n\n${companyname || "[Company Name]"}, a leading name in the industry, is pleased to announce financial results for ${period || "[Period]"}. The company reported revenues of ${revenue || "[Revenue]"} and a net income of ${income || "[Income]"}. One of the notable factors contributing to this performance is ${highlights || "[Highlights]"}.\n\nFor a more detailed breakdown of our financial results and further insights, interested parties are directed to our full report available at ${link || "[Link]"}. For media inquiries or further clarification, please contact ${spokesman || "[Spokesman]"}.`;

  function normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: 410, padding: 24, background: "#23272f", color: "#fff", borderRight: "1px solid #222", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxHeight: '100vh', overflowY: 'auto' }}>
        <h2 style={{ margin: 0, marginTop: 32, marginBottom: 32, color: "#fff", paddingTop: 8, paddingBottom: 16, fontSize: 28, fontWeight: 800, letterSpacing: 1, textAlign: 'center', background: 'none' }}>Financial or Earnings Press Release</h2>
        {/* Input Sections */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>What is the name of the company issuing the financial/earnings report?</label>
          <Input value={companyname} onChange={e => setCompanyname(e.target.value)} placeholder="Company Name" style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>For which period or quarter is the financial report?</label>
          <Input value={period} onChange={e => setPeriod(e.target.value)} placeholder="Period or Quarter" style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>What is the reported revenue for the specified period?</label>
          <Input value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="Reported Revenue" style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>What is the reported net income or profit for the specified period?</label>
          <Input value={income} onChange={e => setIncome(e.target.value)} placeholder="Net Income or Profit" style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>Can you provide key highlights or significant factors contributing to the financial results?</label>
          <Textarea value={highlights} onChange={e => setHighlights(e.target.value)} placeholder="Key Highlights or Factors" rows={3} style={{ color: '#23272f', background: '#fff', marginTop: 4, minHeight: 48, maxHeight: 100, resize: 'vertical', overflowY: 'auto' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>Who is the primary spokesperson or contact person for the financial report?</label>
          <Input value={spokesman} onChange={e => setSpokesman(e.target.value)} placeholder="Spokesperson" style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>Do you have a link to the detailed earnings report or announcement?</label>
          <Input value={link} onChange={e => setLink(e.target.value)} placeholder="Link to Report" style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        {/* Prompt Output */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>Prompt</label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Prompt will appear here after you click Generate Prompt..." rows={7} style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          <Button onClick={() => setPrompt(promptText)}>Generate Prompt</Button>
          <Button onClick={() => prompt && navigator.clipboard.writeText(prompt)} variant="secondary">Copy</Button>
          <Button onClick={() => setPrompt("")} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc' }}>Clear</Button>
        </div>
        {/* Browser URL input */}
        <div style={{ marginBottom: 10 }}>
          <Input value={browserUrl} onChange={e => setBrowserUrl(e.target.value)} placeholder="Enter URL (e.g. https://...)" style={{ color: '#23272f', background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <Button style={{ flex: 1 }} onClick={() => setCurrentUrl(normalizeUrl(browserUrl))}>Go</Button>
          <Button style={{ flex: 1 }} variant="secondary" onClick={() => browserUrl && window.open(normalizeUrl(browserUrl), '_blank')}>Open in New Tab</Button>
        </div>
        {/* Prompt Library button */}
        <Button style={{ marginBottom: 16, width: '100%', background: '#3b82f6', color: '#fff', fontWeight: 600 }} onClick={() => setShowPromptLibrary(true)}>
          Prompt Library
        </Button>
        {/* Prompt Library Modal */}
        {showPromptLibrary && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ background: '#fff', borderRadius: 8, width: '90vw', maxWidth: 900, height: '85vh', boxShadow: '0 6px 32px rgba(0,0,0,0.25)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => setShowPromptLibrary(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 28, fontWeight: 700, color: '#23272f', cursor: 'pointer', zIndex: 2 }}>&times;</button>
              <iframe src="http://localhost:8080/prompt-library" title="Prompt Library" style={{ flex: 1, width: '100%', border: 'none', borderRadius: 8, marginTop: 48 }} />
            </div>
          </div>
        )}
      </div>
      {/* Browser/Preview Area */}
      <div style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", minWidth: 0 }}>
        {currentUrl ? (
          <iframe
            title="Web Browser"
            src={currentUrl}
            style={{ flex: 1, border: "none", width: "100%", minHeight: 0 }}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 22, fontWeight: 500, letterSpacing: 0.5, minHeight: 0 }}>
            Enter a URL and click Go to view a website here.
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialOrEarningsPressRelease;
