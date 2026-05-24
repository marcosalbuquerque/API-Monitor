const express = require('express');
const { probe } = require('../services/probeService');

const router = express.Router();

// POST /api/probe/:id — dispara health check
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await probe(id);

  if (!result) {
    return res.status(404).json({ error: 'API not found in catalog' });
  }

  res.json(result);
});

module.exports = router;
