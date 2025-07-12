const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all recipes
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search recipes by title (case-insensitive)
router.get('/search', async (req, res) => {
  const searchTerm = req.query.q || '';
  try {
    const result = await pool.query(
      `SELECT * FROM recipes WHERE LOWER(title) LIKE LOWER($1)`,
      [`%${searchTerm}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new recipe
router.post('/', async (req, res) => {
  const { title, image, instructions, ingredients } = req.body;
  if (!title || !ingredients) {
    return res.status(400).json({ error: 'Title and ingredients are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO recipes (title, image, instructions, ingredients) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, image || null, instructions || null, ingredients]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an existing recipe by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, image, instructions, ingredients } = req.body;
  if (!title || !ingredients) {
    return res.status(400).json({ error: 'Title and ingredients are required' });
  }
  try {
    const result = await pool.query(
      'UPDATE recipes SET title = $1, image = $2, instructions = $3, ingredients = $4 WHERE id = $5 RETURNING *',
      [title, image || null, instructions || null, ingredients, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a recipe by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
