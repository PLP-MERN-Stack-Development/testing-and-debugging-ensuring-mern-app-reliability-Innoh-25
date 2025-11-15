const Bug = require('../models/Bug');

const bugController = {
  async createBug(req, res) {
    try {
      const {
        title,
        description,
        status,
        priority,
        project,
        stepsToReproduce,
        environment,
      } = req.body;

      const bug = new Bug({
        title,
        description,
        status,
        priority,
        project,
        stepsToReproduce,
        environment,
        reporter: req.user._id,
      });

      await bug.save();

      res.status(201).json({ message: 'Bug reported', bug });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      res.status(500).json({ error: 'Server error while creating bug' });
    }
  },

  async getBugs(req, res) {
    try {
      // If user is authenticated, optionally filter to their bugs via query ?mine=true
      const filter = {};
      if (req.query.mine === 'true' && req.user) {
        filter.reporter = req.user._id;
      }

      const bugs = await Bug.find(filter).populate('reporter', 'username email').sort({ createdAt: -1 });
      res.json(bugs);
    } catch (error) {
      res.status(500).json({ error: 'Server error while fetching bugs' });
    }
  },

  async getBugById(req, res) {
    try {
      const bug = await Bug.findById(req.params.id).populate('reporter', 'username email');
      if (!bug) return res.status(404).json({ error: 'Bug not found' });
      res.json(bug);
    } catch (error) {
      if (error.name === 'CastError') return res.status(400).json({ error: 'Invalid bug ID' });
      res.status(500).json({ error: 'Server error while fetching bug' });
    }
  },

  async updateBug(req, res) {
    try {
      const bug = await Bug.findById(req.params.id);
      if (!bug) return res.status(404).json({ error: 'Bug not found' });

      if (bug.reporter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied. You can only update your own bugs.' });
      }

      const updates = req.body;
      Object.assign(bug, updates);
      await bug.save();

      res.json({ message: 'Bug updated', bug });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      if (error.name === 'CastError') return res.status(400).json({ error: 'Invalid bug ID' });
      res.status(500).json({ error: 'Server error while updating bug' });
    }
  },

  async deleteBug(req, res) {
    try {
      const bug = await Bug.findById(req.params.id);
      if (!bug) return res.status(404).json({ error: 'Bug not found' });

      if (bug.reporter.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied. You can only delete your own bugs.' });
      }

      await Bug.findByIdAndDelete(req.params.id);
      res.json({ message: 'Bug deleted' });
    } catch (error) {
      if (error.name === 'CastError') return res.status(400).json({ error: 'Invalid bug ID' });
      res.status(500).json({ error: 'Server error while deleting bug' });
    }
  },
};

module.exports = bugController;
