const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM recipes ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single recipe
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new recipe
router.post('/', async (req, res) => {
  const { title, image, instructions, ingredients, readyInMinutes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO recipes (title, image, instructions, ingredients, readyInMinutes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, image, instructions, ingredients, readyInMinutes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update recipe
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, image, instructions, ingredients, readyInMinutes } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE recipes SET title=$1, image=$2, instructions=$3, ingredients=$4, readyInMinutes=$5
       WHERE id=$6 RETURNING *`,
      [title, image, instructions, ingredients, readyInMinutes, id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE recipe
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;