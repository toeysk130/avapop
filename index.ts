import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the static frontend
app.use(express.static(path.join(__dirname, 'public')));

// In-memory click counter
let clickCount = 0;

// Serve the static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API route to get the current click count
app.get('/api/clicks', (req, res) => {
    res.json({ clickCount });
});

// API route to increment the click count
app.post('/api/clicks', (req, res) => {
    clickCount++;
    res.json({ clickCount });
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
