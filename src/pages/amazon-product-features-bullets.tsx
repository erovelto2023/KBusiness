import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const AmazonProductFeaturesBulletsPage: React.FC = () => {
  const [product, setProduct] = useState("");
  const [bullets, setBullets] = useState("5");
  const [features, setFeatures] = useState("");
  const [prompt, setPrompt] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [browserUrl, setBrowserUrl] = useState("https://chatgpt.com/");
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [browserMode, setBrowserMode] = useState<'internal' | 'external'>('internal');

  const handleGenerate = () => {
    const generatedPrompt = `Write ${bullets} concise and informative bullet points for the Amazon listing of the ${product}. Each bullet point should emphasize a specific key feature or benefit, such as ${features}, providing potential customers with a clear understanding of the product's value. Make sure the bullet points are well-structured and easy to read, helping to enhance the \"About This Item\" section and make the listing more appealing to buyers.`;
    setPrompt(generatedPrompt);
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
    }
  };

  const handleClear = () => {
    setProduct("");
    setBullets("");
    setFeatures("");
    setPrompt("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: 370, padding: 24, background: "#23272f", color: "#fff", borderRight: "1px solid #222", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxHeight: '100vh', overflowY: 'auto' }}>
        <h2 style={{ margin: 0, marginTop: 32, marginBottom: 32, color: "#fff", paddingTop: 8, paddingBottom: 16, fontSize: 32, fontWeight: 800, letterSpacing: 1, textAlign: 'center', background: 'none' }}>Amazon Product Features</h2>
        <div style={{ marginBottom: 12 }}>
          <label>What is the product you are selling?</label>
          <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="Product Name" style={{ color: '#23272f', background: '#fff' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>How Many Bullet points</label>
          <Input 
            type="number"
            min={1}
            value={bullets}
            onChange={e => {
              const val = e.target.value.replace(/[^\d]/g, "");
              setBullets(val === "" ? "1" : val);
            }}
            placeholder="Number of bullets"
            style={{ color: '#23272f', background: '#fff' }} 
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>What are the key features for this product</label>
          <Input value={features} onChange={e => setFeatures(e.target.value)} placeholder="Key Features" style={{ color: '#23272f', background: '#fff' }} />
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
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Input
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Enter URL (https://...)"
            style={{ flex: 1, background: '#fff', color: '#23272f', border: '1px solid #444' }}
          />
          <Button
            onClick={() => {
              if (customUrl && /^(https?:\/\/)/.test(customUrl)) {
                setBrowserUrl(customUrl);
              }
            }}
            style={{ minWidth: 48 }}
          >Go</Button>
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
              <iframe src="/prompt-library" title="Prompt Library" style={{ flex: 1, width: '100%', border: 'none', borderRadius: 8, marginTop: 48 }} />
            </div>
          </div>
        )}
        {/* Open in New Tab button */}
        <Button
          style={{ marginBottom: 16, width: '100%', background: '#eee', color: '#23272f', fontWeight: 600 }}
          onClick={() => {
            if (customUrl && /^(https?:\/\/)/.test(customUrl)) {
              window.open(customUrl, '_blank');
            }
          }}
        >
          Open in New Tab
        </Button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 0 }}>
          <Button style={{ fontWeight: 500 }} onClick={() => setBrowserUrl('https://chatgpt.com/')}>ChatGPT</Button>
          <Button style={{ fontWeight: 500 }} onClick={() => setBrowserUrl('https://chat.qwen.ai/')}>Qwen Chat</Button>
          <Button style={{ fontWeight: 500 }} onClick={() => setBrowserUrl('https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx')}>Bing</Button>
          <Button style={{ fontWeight: 500 }} onClick={() => setBrowserUrl('https://www.deepseek.com/en')}>Deepseek</Button>
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
        {browserMode === 'internal' ? (
          <iframe
            title="Web Browser"
            src={browserUrl}
            style={{ flex: 1, border: "none", width: "100%" }}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
            <Button style={{ fontSize: 18, padding: '16px 32px', background: '#3b82f6', color: '#fff', fontWeight: 600 }} onClick={() => window.open(browserUrl, '_blank')}>Open in New Tab</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmazonProductFeaturesBulletsPage;
