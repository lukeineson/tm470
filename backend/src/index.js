const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
