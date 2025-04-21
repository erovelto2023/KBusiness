import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

const PINTEREST_ACCESS_TOKEN = process.env.VITE_PINTEREST_ACCESS_TOKEN || process.env.REACT_APP_PINTEREST_ACCESS_TOKEN;

app.get('/api/pinterest/boards', async (req, res) => {
  try {
    const response = await fetch('https://api.pinterest.com/v5/boards', {
      headers: {
        'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Pinterest boards' });
  }
});

// New endpoint for Pinterest keyword suggestions
app.get('/api/pinterest/keywords', async (req, res) => {
  console.log('Received /api/pinterest/keywords request:', req.query);

  const seed = req.query.seed;
  if (!seed) {
    return res.status(400).json({ error: 'Missing seed parameter' });
  }
  try {
    const pinterestUrl = 'https://api.pinterest.com/v5/keywords/get?query=' + encodeURIComponent(seed);
    console.log('Querying Pinterest API:', pinterestUrl);
    const response = await fetch(pinterestUrl, {
      headers: {
        'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error('Failed to parse Pinterest API response as JSON:', jsonErr);
      return res.status(500).json({ error: 'Pinterest API did not return JSON' });
    }
    if (!response.ok) {
      console.error('Pinterest API error:', data);
      return res.status(500).json({ error: data.message || 'Pinterest API error' });
    }
    console.log('Pinterest API response data:', JSON.stringify(data).slice(0, 500));
    // Format results for frontend table
    const keywords = (data.keywords || []).map((item, idx) => ({
      keyword: item.keyword,
      rank: idx + 1,
      wordCount: item.keyword.split(' ').length,
      charCount: item.keyword.length,
      seed,
      monthlySearches: item.monthly_searches,
      cpc: item.cpc,
      competition: item.competition,
    }));
    res.json({ keywords });
  } catch (err) {
    console.error('Error in /api/pinterest/keywords:', err);
    res.status(500).json({ error: 'Failed to fetch Pinterest keywords', details: err.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
