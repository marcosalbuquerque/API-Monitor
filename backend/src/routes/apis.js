const express = require('express');
const catalog = require('../data/catalog.json');

const router = express.Router();

// GET /api/apis — lista de APIs cadastradas
router.get('/', (req, res) => {
  res.json(catalog);
});

module.exports = router;
