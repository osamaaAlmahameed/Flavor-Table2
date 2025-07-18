const express = require('express');
const router = express.Router();
const pool = require('../db');

// Home page route
router.get('/', async (req, res) => {
  try {
    // Get 3 random recipes for the home page
    const { rows } = await pool.query(
      'SELECT * FROM recipes ORDER BY RANDOM() LIMIT 3'
    );
    res.render('index', { recipes: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;