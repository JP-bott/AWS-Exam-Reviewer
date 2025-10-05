const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to serve questions.json explicitly (optional)
app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'questions.json'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
