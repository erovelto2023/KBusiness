import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

const FeatureBenefitLists: React.FC = () => {
  const [product, setProduct] = useState("");
  const [features, setFeatures] = useState(3);
  const [featuresList, setFeaturesList] = useState("");
  const [benefits, setBenefits] = useState("");
  const [prompt, setPrompt] = useState("");
  const [browserUrl, setBrowserUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

  // Prompt template
  const promptText = `Create a feature/benefit list for the ${product || "[Product]"} product or service, highlighting ${features || 3} key features and their corresponding benefits. The features to be highlighted are ${featuresList || "[Features List]"} and the respective benefits are ${benefits || "[Benefits]"}. Craft a compelling and persuasive list that showcases the advantages of using the product or service, making it irresistible to potential customers.`;

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
        <h2 style={{ margin: 0, marginTop: 32, marginBottom: 32, color: "#fff", paddingTop: 8, paddingBottom: 16, fontSize: 28, fontWeight: 800, letterSpacing: 1, textAlign: 'center', background: 'none' }}>Features Benefit Lists</h2>
        {/* Input Sections */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>What product or service</label>
          <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="Product or Service" style={{ color: '#23272f', background: '#fff', marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>How many features/benefits do you want to highlight?</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button onClick={() => setFeatures(Math.max(1, features - 1))} style={{ minWidth: 36, fontSize: 20, padding: '2px 0' }}>-</Button>
            <Input type="number" value={features} min={1} onChange={e => setFeatures(Math.max(1, Number(e.target.value)))} style={{ width: 60, textAlign: 'center', color: '#23272f', background: '#fff' }} />
            <Button onClick={() => setFeatures(features + 1)} style={{ minWidth: 36, fontSize: 20, padding: '2px 0' }}>+</Button>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>List the features you want to highlight, separated by commas.</label>
          <Textarea value={featuresList} onChange={e => setFeaturesList(e.target.value)} placeholder="Feature 1, Feature 2, Feature 3..." rows={2} style={{ color: '#23272f', background: '#fff', marginTop: 4, minHeight: 32, maxHeight: 60, resize: 'vertical', overflowY: 'auto' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#fff', fontWeight: 600 }}>List the corresponding benefits for each feature (separated by commas)</label>
          <Textarea value={benefits} onChange={e => setBenefits(e.target.value)} placeholder="Benefit 1, Benefit 2, Benefit 3..." rows={2} style={{ color: '#23272f', background: '#fff', marginTop: 4, minHeight: 32, maxHeight: 60, resize: 'vertical', overflowY: 'auto' }} />
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

export default FeatureBenefitLists;
