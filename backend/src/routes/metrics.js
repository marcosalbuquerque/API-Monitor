const express = require('express');
const { getMetrics } = require('../services/probeService');

const router = express.Router();

// GET /api/metrics — histórico de checagens em memória
router.get('/', (req, res) => {
  res.json(getMetrics());
});

module.exports = router;
