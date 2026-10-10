const express = require('express');
const path = require('path');
const { inputCleaner, inputValidator } = require('./middleware.js');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit', inputCleaner, inputValidator, (req, res) => {
  const { username, comment } = req.body;
  res.send(`Username: ${username}, Comment: ${comment}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});