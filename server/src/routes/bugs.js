const express = require('express');
const { authenticate, authenticateOptional } = require('../middleware/auth');
const bugController = require('../controllers/bugController');

const router = express.Router();

router.get('/', authenticateOptional, bugController.getBugs);
router.get('/:id', authenticateOptional, bugController.getBugById);
router.post('/', authenticate, bugController.createBug);
router.put('/:id', authenticate, bugController.updateBug);
router.delete('/:id', authenticate, bugController.deleteBug);

module.exports = router;
