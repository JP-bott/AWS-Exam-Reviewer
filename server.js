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

// Export the app for testing and only listen when run directly.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
