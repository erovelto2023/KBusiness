import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const VOICES = [
  "Casual", "Confident", "Creative", "Dramatic", "Educational", "Encouraging", "Engaging", "Entertaining", "Enthusiastic", "Excited", "Formal", "Friendly", "Funny", "Helpful", "Informative", "Inspiring", "Persuasive", "Professional", "Sarcastic", "Serious", "Skeptical", "Trustworthy", "Urgent", "Witty"
];

const AutoresponderSeriesPage: React.FC = () => {
  const [purpose, setPurpose] = useState("");
  const [emails, setEmails] = useState(3);
  const [key, setKey] = useState("");
  const [voice, setVoice] = useState("Enthusiastic");
  const [links, setLinks] = useState("");
  const [prompt, setPrompt] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [browserUrl, setBrowserUrl] = useState("https://chatgpt.com/");
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

  const handleGenerate = () => {
    const generatedPrompt = `Create a ${emails} email autoresponder series for the purpose of ${purpose}. The series should be in a ${voice} tone of voice and convey the key messages or actions ${key}. Each email should be concise, engaging, and focused on nudging the reader towards taking the desired action. Include any specific links or call to actions ${links} where appropriate to encourage the reader to explore your offering or take the next step. Ensure that the series is well-structured and flows smoothly from one email to the next, maintaining the reader's interest and building trust throughout.`;
    setPrompt(generatedPrompt);
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
    }
  };

  const handleClear = () => {
    setPurpose("");
    setEmails(3);
    setKey("");
    setVoice("Enthusiastic");
    setLinks("");
    setPrompt("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: 370, padding: 24, background: "#23272f", color: "#fff", borderRight: "1px solid #222", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxHeight: '100vh', overflowY: 'auto' }}>
        <h2 style={{ margin: 0, marginTop: 32, marginBottom: 32, color: "#fff", paddingTop: 8, paddingBottom: 16, fontSize: 32, fontWeight: 800, letterSpacing: 1, textAlign: 'center', background: 'none' }}>Autoresponder Series</h2>
        <div style={{ marginBottom: 12 }}>
          <label>What is the purpose of this autoresponder series?</label>
          <Input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Purpose" style={{ color: '#23272f', background: '#fff' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>How many Emails should be in the series?</label>
          <Input type="number" value={emails} min={1} max={20} onChange={e => setEmails(Number(e.target.value))} style={{ color: '#23272f', background: '#fff', width: 120 }} />
          <span style={{ marginLeft: 8, color: '#fff' }}>emails</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>What are the key messages or actions you want to convey in the series?</label>
          <Textarea value={key} onChange={e => setKey(e.target.value)} placeholder="Key Messages or Actions" rows={2} style={{ color: '#23272f', background: '#fff' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>What is the voice do you want for the series?</label>
          <select value={voice} onChange={e => setVoice(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #444', background: '#fff', color: '#23272f', marginTop: 4 }}>
            {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Are there any specific links or call to actions you want to include?</label>
          <Input value={links} onChange={e => setLinks(e.target.value)} placeholder="Links or CTAs" style={{ color: '#23272f', background: '#fff' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Prompt</label>
          <Textarea value={prompt} readOnly rows={4} style={{ color: '#23272f', background: '#fff' }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <Button onClick={handleGenerate}>Generate Prompt</Button>
          <Button onClick={handleCopy} variant="secondary">Copy</Button>
          <Button onClick={handleClear} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc' }}>Clear</Button>
        </div>
        {/* Custom URL input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <Input
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Enter URL (https://...)"
            style={{ flex: 1, background: '#fff', color: '#23272f', border: '1px solid #444' }}
          />
          <Button
            onClick={() => {
              if (customUrl && /^(https?:\/\/)/.test(customUrl)) setBrowserUrl(customUrl);
            }}
            style={{ minWidth: 48 }}
          >Go</Button>
        </div>
        <Button
          style={{ marginBottom: 16, width: '100%', background: '#eee', color: '#23272f', fontWeight: 600 }}
          onClick={() => {
            if (customUrl && /^(https?:\/\/)/.test(customUrl)) window.open(customUrl, '_blank');
          }}
        >Open Browser</Button>
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
              <iframe src="/prompt-library" title="Prompt Library" style={{ flex: 1, width: '100%', border: 'none', borderRadius: 8, marginTop: 48 }} />
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 0 }}>
          <Button style={{ fontWeight: 500, width: '48%' }} onClick={() => window.open('https://chatgpt.com/', '_blank')}>ChatGPT</Button>
          <Button style={{ fontWeight: 500, width: '48%' }} onClick={() => window.open('https://chat.qwen.ai/', '_blank')}>Qwen Chat</Button>
        </div>
      </div>
      {/* Browser/Preview Area */}
      <div style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee", background: "#f7f7f7", display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, marginRight: 16 }}>Web Browser :</span>
          <input
            style={{ marginLeft: 0, padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc", width: 300 }}
            value={browserUrl}
            readOnly
          />
        </div>
        <iframe
          title="Web Browser"
          src={browserUrl}
          style={{ flex: 1, border: "none", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default AutoresponderSeriesPage;
