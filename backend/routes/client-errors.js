const express = require('express');
const router = express.Router();

// Accepts error logs from the client and responds with 204
router.post('/', (req, res) => {
  // Optionally, log to a file or external service here
  // console.log('Client error:', req.body);
  res.status(204).send();
});

module.exports = router;
