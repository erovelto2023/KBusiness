import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const AIDAFrameworkSidebar: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [benefits, setBenefits] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [words, setWords] = useState("200");
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    const generatedPrompt = `Create an AIDA framework copy for ${productName}, a ${productType} with features such as ${benefits}. The call to action or special offer is ${callToAction}. The copy should not exceed ${words} words.`;
    setPrompt(generatedPrompt);
  };

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
    }
  };

  const handleClear = () => {
    setProductName("");
    setProductType("");
    setBenefits("");
    setCallToAction("");
    setWords("200");
    setPrompt("");
  };

  return (
    <div style={{ width: 350, padding: 24, background: "#f9f9f9", borderRadius: 12 }}>
      <h2 style={{ marginBottom: 16 }}>AIDA Framework</h2>
      <div style={{ marginBottom: 12 }}>
        <label>What is the name of the product?</label>
        <Input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product Name" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>What type of product or service is it?</label>
        <Input value={productType} onChange={e => setProductType(e.target.value)} placeholder="Type of Product" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>What are the key features or benefits? (Separate by commas)</label>
        <Input value={benefits} onChange={e => setBenefits(e.target.value)} placeholder="Benefits" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>What is the call to action or special offer?</label>
        <Input value={callToAction} onChange={e => setCallToAction(e.target.value)} placeholder="Call to Action" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>What is the maximum word count?</label>
        <Input type="number" value={words} onChange={e => setWords(e.target.value)} placeholder="Word Count" />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Prompt</label>
        <Textarea value={prompt} readOnly rows={4} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button onClick={handleGenerate}>Generate Prompt</Button>
        <Button onClick={handleCopy} variant="secondary">Copy</Button>
        <Button onClick={handleClear} variant="outline">Clear</Button>
      </div>
    </div>
  );
};

export default AIDAFrameworkSidebar;
