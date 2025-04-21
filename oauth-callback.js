const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());

// --- Pinterest OAuth2 Callback Handler ---
app.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;
  if (error) {
    return res.status(400).send(`Pinterest OAuth error: ${error}`);
  }
  if (!code) {
    return res.status(400).send('No code parameter returned from Pinterest.');
  }

  // Exchange code for access token
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.REACT_APP_PINTEREST_APP_ID || process.env.VITE_PINTEREST_APP_ID);
    params.append('client_secret', process.env.REACT_APP_PINTEREST_API_SECRET || process.env.VITE_PINTEREST_API_SECRET);
    params.append('code', code);
    params.append('redirect_uri', req.protocol + '://' + req.get('host') + req.path);

    const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(500).send(`Pinterest token exchange failed: ${JSON.stringify(tokenData)}`);
    }
    // Show the access token to the user (for dev)
    res.send(`Access Token: <pre>${JSON.stringify(tokenData, null, 2)}</pre>`);
  } catch (err) {
    res.status(500).send(`OAuth callback error: ${err.message}`);
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
