require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const recipesRoutes = require('./routes/recipes');
const homeRoutes = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.static('public'));
app.use(express.json());

// Routes
app.use('/api/recipes', recipesRoutes);
app.use('/api/home', homeRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server after DB connects
pool.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Could not connect to database:', err);
  });

// Export the pool for use in other files
module.exports = pool;
