// Pinterest API utility functions
// Loads credentials from environment variables

const APP_ID = import.meta.env.VITE_PINTEREST_APP_ID;
const API_SECRET = import.meta.env.VITE_PINTEREST_API_SECRET;
const ACCESS_TOKEN = import.meta.env.VITE_PINTEREST_ACCESS_TOKEN;

const BASE_URL = 'https://api.pinterest.com/v5';

// Helper to build headers
function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

// Boards
export async function fetchBoards() {
  // Use the local backend proxy instead of direct Pinterest API call
  const res = await fetch('http://localhost:5001/api/pinterest/boards');
  if (!res.ok) throw new Error('Failed to fetch boards');
  return res.json();
}

// Pins for a board
export async function fetchPins(boardId: string) {
  const res = await fetch(`${BASE_URL}/boards/${boardId}/pins`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch pins');
  return res.json();
}

// Trends (example endpoint)
export async function fetchTrends() {
  const res = await fetch(`${BASE_URL}/trends/keywords`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

// User profile
export async function fetchUserProfile(userId: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

// Add more endpoints as needed (annotations, keywords, etc.)
