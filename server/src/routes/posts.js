const express = require('express');
const { authenticate } = require('../middleware/auth');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', authenticate, postController.createPost);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;