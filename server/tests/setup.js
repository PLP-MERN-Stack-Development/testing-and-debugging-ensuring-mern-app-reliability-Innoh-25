const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState === 1) return;
  // Lazily require mongodb-memory-server to avoid unnecessary startup when not installed
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Do not clear collections or disconnect here because this setup file is run per
// test file; tests themselves manage cleanup to avoid interfering with other
// test suites. Stop the in-memory server on process exit.
const _stopHandlers = async () => {
  try {
    if (mongoServer) await mongoServer.stop();
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
  } catch (e) {
    // swallow errors during shutdown
  }
};

process.on('SIGINT', async () => {
  await _stopHandlers();
  process.exit(0);
});

process.on('beforeExit', async () => {
  await _stopHandlers();
});

process.on('exit', async () => {
  // synchronous exit handler cannot await, but attempt a best-effort stop
  if (mongoServer && typeof mongoServer.stop === 'function') {
    try {
      // don't await here; just trigger stop
      mongoServer.stop();
    } catch (e) {}
  }
});

global.testUtils = {
  createTestUser: async (userData = {}) => {
    const User = require('../src/models/User');
    return await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      ...userData,
    });
  },

  createTestPost: async (postData = {}) => {
    const Post = require('../src/models/Post');
    return await Post.create({
      title: 'Test Post',
      content: 'This is a test post content',
      author: new mongoose.Types.ObjectId(),
      category: new mongoose.Types.ObjectId(),
      slug: 'test-post',
      ...postData,
    });
  },

  generateAuthToken: (user) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );
  },
};