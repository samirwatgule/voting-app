const express = require('express');
const router = express.Router();
const Elector = require('../models/Elector');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Vote for a distinct elector
// @route   POST /api/votes/:electorId
// @access  Private
router.post('/:electorId', protect, async (req, res) => {
  try {
    // Admin cannot vote
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admin is not allowed to vote' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if the user has already voted
    if (user.isVoted) {
      return res.status(400).json({ message: 'You have already cast your vote' });
    }

    const elector = await Elector.findById(req.params.electorId);
    if (!elector) {
      return res.status(404).json({ message: 'Elector not found' });
    }

    // Increment Elector Vote
    elector.voteCount += 1;
    await elector.save();

    // Mark User as voted
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: 'Vote successfully recorded!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get vote counts of all electors
// @route   GET /api/votes/count
// @access  Public
router.get('/count', async (req, res) => {
  try {
    // Sorting electors by standard high-vote orders
    const electors = await Elector.find({}).sort({ voteCount: -1 });
    // Transform to simplified object tracking
    const voteData = electors.map(e => ({
      _id: e._id,
      name: e.name,
      party: e.party,
      voteCount: e.voteCount
    }));

    res.json(voteData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
