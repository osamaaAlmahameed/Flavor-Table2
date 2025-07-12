const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to Flavor Table 2');
});

module.exports = router;
