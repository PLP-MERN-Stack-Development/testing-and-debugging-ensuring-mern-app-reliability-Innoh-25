const Post = require('../models/Post');

const postController = {
  async createPost(req, res) {
    try {
      const { title, content, category } = req.body;


      const post = new Post({
        title,
        content,
        category,
        author: req.user._id,
      });


      await post.save();

      res.status(201).json({
        message: 'Post created successfully',
        post,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      res.status(500).json({ error: 'Server error while creating post' });
    }
  },

  async getPosts(req, res) {
    try {
      const posts = await Post.find()
        .populate('author', 'username email')
        .sort({ createdAt: -1 });

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Server error while fetching posts' });
    }
  },

  async getPostById(req, res) {
    try {
      const post = await Post.findById(req.params.id)
        .populate('author', 'username email');

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.json(post);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      res.status(500).json({ error: 'Server error while fetching post' });
    }
  },

  async updatePost(req, res) {
    try {
      const { title, content } = req.body;

      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied. You can only update your own posts.' });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true, runValidators: true }
      ).populate('author', 'username email');

      res.json({
        message: 'Post updated successfully',
        post: updatedPost,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      res.status(500).json({ error: 'Server error while updating post' });
    }
  },

  async deletePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied. You can only delete your own posts.' });
      }

      await Post.findByIdAndDelete(req.params.id);

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      res.status(500).json({ error: 'Server error while deleting post' });
    }
  },
};

module.exports = postController;