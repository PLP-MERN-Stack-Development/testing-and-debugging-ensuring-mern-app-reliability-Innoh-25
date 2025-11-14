import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
  }),
  createMockPost: () => ({
    _id: '507f1f77bcf86cd799439012',
    title: 'Test Post',
    content: 'Test content',
    author: '507f1f77bcf86cd799439011',
    category: '507f1f77bcf86cd799439013',
    slug: 'test-post',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
};