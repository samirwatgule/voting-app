const express = require('express');
const router = express.Router();
const Elector = require('../models/Elector');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all electors
// @route   GET /api/electors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const electors = await Elector.find({});
    res.json(electors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new elector
// @route   POST /api/electors
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, party, age } = req.body;
    
    if (age < 18) {
      return res.status(400).json({ message: 'Elector must be at least 18 years old.' });
    }

    const elector = new Elector({ name, party, age });
    const createdElector = await elector.save();
    
    res.status(201).json(createdElector);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update elector
// @route   PUT /api/electors/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, party, age } = req.body;
    const elector = await Elector.findById(req.params.id);

    if (elector) {
      elector.name = name || elector.name;
      elector.party = party || elector.party;
      elector.age = age || elector.age;

      const updatedElector = await elector.save();
      res.json(updatedElector);
    } else {
      res.status(404).json({ message: 'Elector not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete elector
// @route   DELETE /api/electors/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const elector = await Elector.findById(req.params.id);

    if (elector) {
      await Elector.deleteOne({ _id: req.params.id });
      res.json({ message: 'Elector removed successfully' });
    } else {
      res.status(404).json({ message: 'Elector not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
