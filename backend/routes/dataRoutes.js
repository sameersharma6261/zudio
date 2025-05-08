const express = require('express');
const router = express.Router();
const Data = require('../models/data'); // Replace with your model file path

// Route to get all data
router.get('/get-data', async (req, res) => {
  try {
    const data = await Data.find(); // Fetch all data from MongoDB
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
