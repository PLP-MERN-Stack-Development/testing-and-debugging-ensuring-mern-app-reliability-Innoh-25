const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

let token;
let userId;
let postId;

// Setup before all tests
beforeAll(async () => {
  // Database is already connected via setup.js
  
  // Create a test user
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;
  token = generateToken(user);

  // Create a test post
  const post = await Post.create({
    title: 'Test Post',
    content: 'This is a test post content',
    author: userId,
    category: new mongoose.Types.ObjectId(),
    slug: 'test-post',
  });
  postId = post._id;
});

// Clean up after each test
afterEach(async () => {
  await Post.deleteMany({ _id: { $ne: postId } });
});

// Clean up after all tests
afterAll(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

describe('POST /api/posts', () => {
  test('should create a new post when authenticated', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);
    if (res.status !== 201) {
      // Debug helper: print response body when test fails
      // (temporary change to diagnose CI/local failure)
      // eslint-disable-next-line no-console
      console.error('CREATE POST RESPONSE:', res.status, res.body);
    }

    expect(res.status).toBe(201);
    expect(res.body.post).toHaveProperty('_id');
    expect(res.body.post.title).toBe(newPost.title);
  });

  test('should return 401 if not authenticated', async () => {
    const newPost = {
      title: 'Unauthorized Post',
      content: 'This should not be created',
    };

    const res = await request(app)
      .post('/api/posts')
      .send(newPost);

    expect(res.status).toBe(401);
  });
});

describe('GET /api/posts', () => {
  test('should return all posts', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('should return a post by ID', async () => {
    const res = await request(app).get(`/api/posts/${postId}`);
    if (res.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('GET POST BY ID RESPONSE:', res.status, res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(postId.toString());
  });
});

describe('PUT /api/posts/:id', () => {
  test('should update a post when authenticated as author', async () => {
    const updates = {
      title: 'Updated Test Post',
      content: 'This content has been updated',
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);
    if (res.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('UPDATE POST RESPONSE:', res.status, res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.post.title).toBe(updates.title);
  });
});

describe('DELETE /api/posts/:id', () => {
  test('should delete a post when authenticated as author', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    if (res.status !== 200) {
      // eslint-disable-next-line no-console
      console.error('DELETE POST RESPONSE:', res.status, res.body);
    }

    expect(res.status).toBe(200);
  });
});