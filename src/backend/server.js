const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Ethereum Wallet Tracker Backend Running'));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working!' });
});

app.use(express.json());

require('dotenv').config();
