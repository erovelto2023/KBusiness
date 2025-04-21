import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const VOICES = [
  "Casual", "Confident", "Creative", "Dramatic", "Educational", "Encouraging", "Engaging", "Entertaining", "Enthusiastic", "Excited", "Formal", "Friendly", "Funny", "Helpful", "Informative", "Inspiring", "Persuasive", "Professional", "Sarcastic", "Serious", "Skeptical", "Trustworthy", "Urgent", "Witty"
];
const KEYWORD_TYPES = ["High Search Volume", "Low Competition", "Balanced"];

const BlogArticleWizardPage: React.FC = () => {
  // Browser panel state
  const [browserUrl, setBrowserUrl] = useState("http://localhost:8080/prompt-library");
  const [currentUrl, setCurrentUrl] = useState("http://localhost:8080/prompt-library");

  // Helper to normalize URLs
  function normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }
  // Wizard state
  const [tab, setTab] = useState(0);

  // Tab 1: Keywords
  const [topic, setTopic] = useState("");
  const [numKw, setNumKw] = useState(10);
  const [keywordTypes, setKeywordTypes] = useState(KEYWORD_TYPES[0]);
  const [kwPrompt, setKwPrompt] = useState("");

  // Tab 2: Titles
  const [keywords, setKeywords] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [titleNumber, setTitleNumber] = useState(5);
  const [titleVoice, setTitleVoice] = useState(VOICES[0]);
  const [titlesPrompt, setTitlesPrompt] = useState("");

  // Tab 3: Outlines
  const [blogTitle, setBlogTitle] = useState("");
  const [sections, setSections] = useState(5);
  const [outlines, setOutlines] = useState(1);
  const [outlineVoice, setOutlineVoice] = useState(VOICES[0]);
  const [outlinePrompt, setOutlinePrompt] = useState("");

  // Tab 4: Finish
  const [finishVoice, setFinishVoice] = useState(VOICES[0]);
  const [callToAction, setCallToAction] = useState("");
  const [words, setWords] = useState(200);
  const [sectionTitles, setSectionTitles] = useState<string[]>([]);
  const [finishPrompt, setFinishPrompt] = useState("");

  // Modal
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

  // Carry over section titles from outlines
  React.useEffect(() => {
    // Only auto-fill section titles if user has not entered any (i.e. on first tab visit or when cleared)
    setSectionTitles(prev => prev.length === 0 ? Array.from({length: sections}, () => "") : prev.length !== sections ?
      Array.from({length: sections}, (_, i) => prev[i] || "") : prev
    );
  }, [sections]);

  // Tab content generators
  const kwPromptText = `Conduct keyword research for the topic or niche ${topic} and generate a list of ${numKw} relevant keywords. Focus on finding ${keywordTypes} keywords that will help improve the website's visibility, drive traffic, and optimize the content for search engines. The keywords should be closely related to the main topic and provide opportunities for creating valuable and engaging content that resonates with the target audience. Also provide estimated monthly search volume, cost per click, ad competition, and organic search competition nicely formatted inside a table.`;

  const titlesPromptText = `Generate a list of ${titleNumber} creative and captivating blog/article titles related to the main topic of ${topic} and adopt a ${titleVoice} tone of voice. Make sure to incorporate the keywords ${keywords} throughout the titles, ensuring they are optimized for search engines. Make sure the titles are engaging, thought-provoking, and tailored to attract the target audience interest. Each title should reflect a unique aspect or perspective of the main topic, offering diverse content ideas for readers to explore. Also, make sure they are specifically tailored for the target audience of ${targetAudience}.`;

  const outlinePromptText = `Please provide ${outlines} outlines for a blog/article on the topic of ${topic}, with the title "${blogTitle}" and adopt a ${outlineVoice} tone of voice. Each outline should have ${sections} section headlines only, and should incorporate the keywords ${keywords} throughout the sub-headlines. Please do not include any bullet points or additional content in each section. Again, do not provide any bullet points, I only want the section headlines. Also, do not include "Introduction" or "Conclusion" as section headlines.`;

  const finishPromptText = `Create a full detailed blog/article on the topic of ${topic} with the following title: "${blogTitle}". Organize the content into the following sections: ${sectionTitles.map((t, i) => `{sections${i+1}}`).join(',')}. Make sure each section contains over ${words} words. Include a detailed introduction at the beginning and a conclusion at the end. Adopt a ${finishVoice} tone of voice and incorporate the keywords (${keywords}) throughout the content, ensuring the final piece is optimized for search engines. Each section should cover a different aspect of the main topic and be designed to guide the content creation process, resulting in a well-organized, informative, and engaging article for the readers. Also, include the call-to-action near the end of the article: ${callToAction}.`;

  // Tab panel rendering
  const renderTab = () => {
    switch(tab) {
      case 0:
        return (
          <>
            <div style={{ marginBottom: 12 }}>
              <label>What is the main topic or niche?</label>
              <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Main Topic or Niche" style={{ color: '#23272f', background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>How many keywords would you like to generate?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button onClick={() => setNumKw(Math.max(1, numKw - 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>-</Button>
                <Input type="number" value={numKw} min={1} max={100} onChange={e => setNumKw(Number(e.target.value))} style={{ color: '#23272f', background: '#fff', width: 80, textAlign: 'center' }} />
                <Button onClick={() => setNumKw(Math.min(100, numKw + 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>+</Button>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>What type of keywords are you looking for?</label>
              <select value={keywordTypes} onChange={e => setKeywordTypes(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #444', background: '#fff', color: '#23272f', marginTop: 4 }}>
                {KEYWORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Prompt</label>
              <Textarea
  value={kwPrompt}
  onChange={e => setKwPrompt(e.target.value)}
  placeholder="Prompt will appear here after you click Generate Prompt..."
  rows={6}
  style={{ color: '#23272f', background: '#fff' }}
/>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <Button onClick={() => setKwPrompt(kwPromptText)}>Generate Prompt</Button>
              <Button onClick={() => kwPrompt && navigator.clipboard.writeText(kwPrompt)} variant="secondary">Copy</Button>
              <Button onClick={() => setKwPrompt("")} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc' }}>Clear</Button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div style={{ marginBottom: 12 }}>
              <label>What keywords do you want to rank for?</label>
              <Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Keywords (comma separated)" style={{ color: '#23272f', background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Target Audience?</label>
              <Input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Target Audience" style={{ color: '#23272f', background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>How many titles?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button onClick={() => setTitleNumber(Math.max(1, titleNumber - 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>-</Button>
                <Input type="number" value={titleNumber} min={1} max={50} onChange={e => setTitleNumber(Number(e.target.value))} style={{ color: '#23272f', background: '#fff', width: 80, textAlign: 'center' }} />
                <Button onClick={() => setTitleNumber(Math.min(50, titleNumber + 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>+</Button>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Tone of voice</label>
              <select value={titleVoice} onChange={e => setTitleVoice(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #444', background: '#fff', color: '#23272f', marginTop: 4 }}>
                {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Prompt</label>
              <Textarea
  value={titlesPrompt}
  onChange={e => setTitlesPrompt(e.target.value)}
  placeholder="Prompt will appear here after you click Generate Prompt..."
  rows={6}
  style={{ color: '#23272f', background: '#fff' }}
/>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <Button onClick={() => setTitlesPrompt(titlesPromptText)}>Generate Prompt</Button>
              <Button onClick={() => titlesPrompt && navigator.clipboard.writeText(titlesPrompt)} variant="secondary">Copy</Button>
              <Button onClick={() => setTitlesPrompt("")} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc' }}>Clear</Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div style={{ marginBottom: 12 }}>
              <label>What is the blog/article title?</label>
              <Input value={blogTitle} onChange={e => setBlogTitle(e.target.value)} placeholder="Blog/Article Title" style={{ color: '#23272f', background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>How many sections per outline?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button onClick={() => setSections(Math.max(1, sections - 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>-</Button>
                <Input type="number" value={sections} min={1} max={20} onChange={e => setSections(Number(e.target.value))} style={{ color: '#23272f', background: '#fff', width: 80, textAlign: 'center' }} />
                <Button onClick={() => setSections(Math.min(20, sections + 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>+</Button>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>How many outlines to generate?</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button onClick={() => setOutlines(Math.max(1, outlines - 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>-</Button>
                <Input type="number" value={outlines} min={1} max={10} onChange={e => setOutlines(Number(e.target.value))} style={{ color: '#23272f', background: '#fff', width: 80, textAlign: 'center' }} />
                <Button onClick={() => setOutlines(Math.min(10, outlines + 1))} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', minWidth: 36 }}>+</Button>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>What tone of voice?</label>
              <select value={outlineVoice} onChange={e => setOutlineVoice(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #444', background: '#fff', color: '#23272f', marginTop: 4 }}>
                {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Prompt</label>
              <Textarea
  value={outlinePrompt}
  onChange={e => setOutlinePrompt(e.target.value)}
  placeholder="Prompt will appear here after you click Generate Prompt..."
  rows={6}
  style={{ color: '#23272f', background: '#fff' }}
/>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <Button onClick={() => setOutlinePrompt(outlinePromptText)}>Generate Prompt</Button>
              <Button onClick={() => outlinePrompt && navigator.clipboard.writeText(outlinePrompt)} variant="secondary">Copy</Button>
              <Button onClick={() => setOutlinePrompt("")} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc' }}>Clear</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div style={{ marginBottom: 12 }}>
              <label>Tone of Voice</label>
              <select value={finishVoice} onChange={e => setFinishVoice(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #444', background: '#fff', color: '#23272f', marginTop: 4 }}>
                {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>What is your call to action?</label>
              <Input value={callToAction} onChange={e => setCallToAction(e.target.value)} placeholder="Call to Action" style={{ color: '#23272f', background: '#fff' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>How many words per section?</label>
              <Input type="number" value={words} min={50} max={2000} onChange={e => setWords(Number(e.target.value))} style={{ color: '#23272f', background: '#fff', width: 120 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Section Titles</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sectionTitles.map((t, i) => (
                  <Input key={i} value={sectionTitles[i]} onChange={e => {
                    const arr = [...sectionTitles];
                    arr[i] = e.target.value;
                    setSectionTitles(arr);
                  }} placeholder={`Section ${i+1} Title`} style={{ color: '#23272f', background: '#fff' }} />
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Prompt</label>
              <Textarea
  value={finishPrompt}
  onChange={e => setFinishPrompt(e.target.value)}
  placeholder="Prompt will appear here after you click Generate Prompt..."
  rows={8}
  style={{ color: '#23272f', background: '#fff' }}
/>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <Button onClick={() => setFinishPrompt(finishPromptText)}>Generate Prompt</Button>
              <Button onClick={() => finishPrompt && navigator.clipboard.writeText(finishPrompt)} variant="secondary">Copy</Button>
              <Button onClick={() => setFinishPrompt("")} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc' }}>Clear</Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Tab labels
  const tabLabels = ["Keywords", "Titles", "Outlines", "Finish"];

  // Sidebar and browser layout
  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff" }}>
      {/* Sidebar */}
      <div style={{ width: 410, padding: 24, background: "#23272f", color: "#fff", borderRight: "1px solid #222", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxHeight: '100vh', overflowY: 'auto' }}>
        <h2 style={{ margin: 0, marginTop: 32, marginBottom: 32, color: "#fff", paddingTop: 8, paddingBottom: 16, fontSize: 28, fontWeight: 800, letterSpacing: 1, textAlign: 'center', background: 'none' }}>Blog Article Wizard</h2>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {tabLabels.map((label, idx) => (
            <Button key={label} variant={tab === idx ? "default" : "outline"} style={{ flex: 1, fontWeight: 700, color: tab === idx ? '#fff' : '#23272f', background: tab === idx ? '#3b82f6' : '#fff', border: tab === idx ? 'none' : '1px solid #ccc' }} onClick={() => setTab(idx)}>{label}</Button>
          ))}
        </div>
        {/* Tab content */}
        <div>{renderTab()}</div>
        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 12, marginBottom: 16 }}>
          <Button onClick={() => setTab(Math.max(0, tab - 1))} disabled={tab === 0} variant="outline" style={{ color: '#23272f', background: '#fff', border: '1px solid #ccc', flex: 1 }}>Previous</Button>
          <Button onClick={() => setTab(Math.min(tabLabels.length - 1, tab + 1))} disabled={tab === tabLabels.length - 1} style={{ flex: 1 }}>Next</Button>
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
        {/* Quick links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 0 }}>
          <Button style={{ fontWeight: 500, width: '48%' }} onClick={() => window.open('https://chatgpt.com/', '_blank')}>ChatGPT</Button>
          <Button style={{ fontWeight: 500, width: '48%' }} onClick={() => window.open('https://chat.qwen.ai/', '_blank')}>Qwen Chat</Button>
        </div>
      </div>
      {/* Browser/Preview Area */}
      <div style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee", background: "#f7f7f7", display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 500, marginRight: 16 }}>Web Browser :</span>
          <input
            style={{ marginLeft: 0, padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc", width: 300 }}
            value={browserUrl}
            onChange={e => setBrowserUrl(e.target.value)}
            placeholder="Enter URL (e.g. https://...)"
          />
          <Button style={{ marginLeft: 8 }} onClick={() => setCurrentUrl(normalizeUrl(browserUrl))}>
            Go
          </Button>
          <Button style={{ marginLeft: 8 }} variant="secondary" onClick={() => browserUrl && window.open(normalizeUrl(browserUrl), '_blank')}>
            Open Browser
          </Button>
        </div>
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

export default BlogArticleWizardPage;
