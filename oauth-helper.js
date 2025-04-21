const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Helper to generate the Pinterest OAuth URL
app.get('/generate-oauth-link', (req, res) => {
  const client_id = process.env.REACT_APP_PINTEREST_APP_ID || process.env.VITE_PINTEREST_APP_ID;
  const redirect_uri = encodeURIComponent('http://localhost:5001/callback');
  const scopes = encodeURIComponent('ads:read ads:write boards:read boards:write pins:read pins:write user_accounts:read'); // Adjust scopes as needed
  const state = 'your_custom_state'; // You can randomize this for security

  const oauthUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes}&state=${state}`;
  res.send(`<h2>Pinterest OAuth Link</h2><a href="${oauthUrl}" target="_blank">Connect with Pinterest</a><br/><pre>${oauthUrl}</pre>`);
});

const PORT = 5002;
app.listen(PORT, () => console.log(`OAuth helper running on port ${PORT}`));
